import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import * as crypto from 'crypto';

@Injectable()
export class ScansService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  // ─── In-memory rate limiting, dedup, caching, and circuit breaker ──────────
  private activeRequests = 0;
  private readonly MAX_CONCURRENT = 2;
  private readonly TIMEOUT_MS = 15000;
  private readonly MAX_RETRIES = 3;
  private readonly CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
  private readonly COOLDOWN_MS = 60 * 1000; // 1 minute

  private inflightMap = new Map<string, Promise<any>>();
  private cacheMap = new Map<string, { data: any; timestamp: number }>();
  private cooldownUntil: number | null = null;

  // ─── Keyword-based fallback classification ─────────────────────────────────
  private readonly FALLBACK_TABLE: Array<{
    keywords: string[];
    category: string;
    ecoScore: number;
    tips: string;
  }> = [
    {
      keywords: ['botol', 'plastik', 'aqua', 'pet', 'pvc', 'hdpe', 'pp', 'minuman', 'gelas plastik', 'sedotan', 'kresek', 'bungkus', 'pouch', 'kemasan plastik'],
      category: 'PLASTIC',
      ecoScore: 65,
      tips: 'Botol plastik dapat dicuci dan didaur ulang. Pisahkan dari tutup dan label sebelum dibuang ke tempat sampah daur ulang.',
    },
    {
      keywords: ['kardus', 'kertas', 'koran', 'majalah', 'buku', 'dupleks', 'karton', 'hvs', 'a4', 'amplop', 'kalender', 'poster', 'karton box'],
      category: 'PAPER',
      ecoScore: 75,
      tips: 'Kertas dan kardus dapat didaur ulang hingga 5-7 kali. Pastikan dalam keadaan kering dan bersih untuk hasil daur ulang optimal.',
    },
    {
      keywords: ['kaleng', 'aluminium', 'besi', 'baja', 'logam', 'seng', 'tembaga', 'kuningan', 'timah', 'stainless'],
      category: 'METAL',
      ecoScore: 80,
      tips: 'Logam adalah material yang dapat didaur ulang tanpa batas. Setelah dibersihkan, kaleng bisa dijual ke pengepul logam terdekat.',
    },
    {
      keywords: ['kaca', 'botol kaca', 'gelas kaca', 'piring', 'mangkuk', 'cermin', 'kaca bening'],
      category: 'GLASS',
      ecoScore: 85,
      tips: 'Kaca dapat didaur ulang 100% tanpa kehilangan kualitas. Pisahkan kaca berdasarkan warna untuk nilai daur ulang lebih tinggi.',
    },
    {
      keywords: ['makanan', 'sisa', 'daun', 'sayur', 'buah', 'nasi', 'kulit', 'tulang', 'organik', 'kompos', 'kotoran', 'sampah dapur'],
      category: 'ORGANIC',
      ecoScore: 90,
      tips: 'Sampah organik dapat diolah menjadi kompos yang bermanfaat untuk tanaman. Gunakan metode compost bin atau lubang biopori di halaman rumah.',
    },
    {
      keywords: ['baterai', 'kabel', 'charger', 'hp', 'ponsel', 'laptop', 'elektronik', 'tv', 'remote', 'lampu', 'pcb', 'sirkuit', 'kipas', 'adaptor'],
      category: 'ELECTRONIC',
      ecoScore: 70,
      tips: 'Sampah elektronik mengandung bahan berbahaya. Jangan buang sembarangan! Bawa ke pusat daur ulang e-waste terdekat untuk penanganan khusus.',
    },
  ];

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log(
      "GEMINI KEY:",
      apiKey ? apiKey.slice(-6) : "NOT_FOUND"
    );
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);

    // Configure Gemini 2.0 Flash with structured JSON output schema
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            category: {
              type: SchemaType.STRING,
              description: 'The category of the waste. MUST be one of: PLASTIC, ORGANIC, PAPER, GLASS, ELECTRONIC, METAL, OTHERS',
            },
            confidence: {
              type: SchemaType.NUMBER,
              description: 'Confidence score of the classification, ranging from 0.0 to 1.0',
            },
            brand: {
              type: SchemaType.STRING,
              description: 'The recognized product brand or logo printed on the packaging, or null if none detected by OCR.',
            },
            ocrText: {
              type: SchemaType.STRING,
              description: 'Raw textual content read from the packaging labels or barcodes via OCR, or null if none.',
            },
            ecoScore: {
              type: SchemaType.INTEGER,
              description: 'Environmental friendliness score from 0 to 100 based on recyclability.',
            },
            tips: {
              type: SchemaType.STRING,
              description: 'Detailed, highly practical step-by-step recycling, reuse, or safe disposal recommendations in Indonesian language.',
            },
          },
          required: ['category', 'confidence', 'ecoScore', 'tips'],
        },
      },
      systemInstruction: 'You are SmartSort AI, a professional waste management and recycling vision engine. Analyze the provided image of garbage/waste. Correctly classify its primary material into one of the designated categories. Use OCR capabilities to extract any packaging text or brand names. Provide realistic eco scores (0-100) and actionable, premium recycling suggestions in Indonesian.',
    });
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /** Compute MD5 hash of base64 image data for deduplication */
  private md5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /** Detect if an error is a Gemini quota / rate-limit error */
  private isQuotaError(error: any): boolean {
    const message =
      error?.message?.toLowerCase() ||
      error?.status?.toString()?.toLowerCase() ||
      error?.toString()?.toLowerCase() ||
      '';
    return (
      message.includes('429') ||
      message.includes('too many requests') ||
      message.includes('quota exceeded') ||
      message.includes('rate limit') ||
      message.includes('resource_exhausted') ||
      (message.includes('quota') && message.includes('exceeded'))
    );
  }

  /** Detect transient errors worth a retry */
  private isRetryableError(error: any): boolean {
    const message =
      error?.message?.toLowerCase() ||
      error?.toString()?.toLowerCase() ||
      '';
    if (message === 'timeout') return true;
    if (message.includes('network') || message.includes('econnrefused') || message.includes('econnreset') || message.includes('etimedout')) return true;
    if (message.includes('internal') || message.includes('unavailable') || message.includes('service unavailable')) return true;
    if (message.includes('5') && (message.includes('error') || message.includes('server'))) return true;
    return false;
  }

  /** Return a user-safe message, never leaking provider internals */
  private safeErrorMessage(error: any): string {
    if (this.isQuotaError(error)) {
      return 'Analisis AI sedang sibuk. Silakan coba kembali beberapa saat lagi.';
    }
    const message =
      error?.message?.toLowerCase() ||
      error?.toString()?.toLowerCase() ||
      '';
    if (message.includes('timeout') || message === 'timeout') {
      return 'Analisis AI membutuhkan waktu lebih lama. Silakan coba kembali.';
    }
    if (message.includes('invalid') || message.includes('bad request')) {
      return 'Gambar tidak valid. Pastikan Anda mengirimkan file gambar yang benar.';
    }
    return 'Analisis AI sedang sibuk. Silakan coba kembali beberapa saat lagi.';
  }

  /** Simple semaphore: limit concurrent Gemini calls */
  private async acquire(): Promise<void> {
    while (this.activeRequests >= this.MAX_CONCURRENT) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.activeRequests++;
  }

  private release(): void {
    this.activeRequests--;
  }

  /** Check if provider cooldown is active */
  private isCooldownActive(): boolean {
    if (this.cooldownUntil && Date.now() < this.cooldownUntil) {
      return true;
    }
    if (this.cooldownUntil && Date.now() >= this.cooldownUntil) {
      this.cooldownUntil = null;
      console.log('[SmartSort] Gemini cooldown expired.');
    }
    return false;
  }

  /** Activate cooldown after a quota error */
  private activateCooldown(): void {
    this.cooldownUntil = Date.now() + this.COOLDOWN_MS;
    console.log(
      `[SmartSort] Gemini cooldown activated until ${new Date(this.cooldownUntil).toISOString()}`,
    );
  }

  /**
   * Call Gemini with retry + exponential backoff + timeout.
   * Returns the raw response text on success.
   */
  private async callGeminiWithRetry(
    imagePart: any,
    prompt: string,
  ): Promise<string> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result: any = await Promise.race([
          this.model.generateContent([prompt, imagePart]),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), this.TIMEOUT_MS),
          ),
        ]);
        return result.response.text();
      } catch (error: any) {
        lastError = error;

        // Quota errors: do NOT retry — activate cooldown instead
        if (this.isQuotaError(error)) {
          this.activateCooldown();
          throw error;
        }

        // Non-retryable: bail immediately
        if (!this.isRetryableError(error)) {
          throw error;
        }

        // Last attempt: let it throw
        if (attempt >= this.MAX_RETRIES) {
          throw error;
        }

        // Exponential backoff with jitter
        const delay = Math.min(
          1000 * Math.pow(2, attempt - 1) + Math.random() * 500,
          5000,
        );
        console.log(
          `[SmartSort] Gemini retry ${attempt}/${this.MAX_RETRIES} after ${Math.round(delay)}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Fallback: keyword-based local classification.
   * Returns a fully-formed result matching Gemini's schema.
   */
  private fallbackClassify(
    textHint: string | null,
  ): {
    category: string;
    confidence: number;
    brand: string | null;
    ocrText: string | null;
    ecoScore: number;
    tips: string;
  } {
    const lower = (textHint || '').toLowerCase();

    for (const entry of this.FALLBACK_TABLE) {
      for (const keyword of entry.keywords) {
        if (lower.includes(keyword)) {
          return {
            category: entry.category,
            confidence: 0.6,
            brand: null,
            ocrText: textHint || null,
            ecoScore: entry.ecoScore,
            tips: entry.tips,
          };
        }
      }
    }

    // Default: unknown waste
    return {
      category: 'OTHERS',
      confidence: 0.3,
      brand: null,
      ocrText: textHint || null,
      ecoScore: 40,
      tips: 'Kami tidak dapat mengidentifikasi jenis sampah ini secara otomatis. Silakan coba scan ulang dengan pencahayaan yang lebih baik, atau buang di tempat sampah yang sesuai.',
    };
  }

  // ─── Core scan method ──────────────────────────────────────────────────────

  async detectWaste(base64Image: string, userId: string) {
    // ── 1. INPUT VALIDATION ──────────────────────────────────────────────────
    if (!base64Image) {
      throw new BadRequestException('Image data is required');
    }

    const approximateSizeInBytes = base64Image.length * 0.75;
    if (approximateSizeInBytes > 5 * 1024 * 1024) {
      throw new BadRequestException('Image size exceeds the 5MB upload limit');
    }

    // ── 2. DB RATE LIMIT CHECK (existing) ────────────────────────────────────
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const recentScansCount = await this.prisma.scan.count({
      where: {
        userId,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentScansCount >= 15) {
      throw new BadRequestException('Scan rate limit exceeded (Max 15 scans per hour). Please try again later.');
    }

    // ── 3. PARSE BASE64 ──────────────────────────────────────────────────────
    let mimeType = 'image/jpeg';
    let cleanBase64 = base64Image;

    if (base64Image.includes(';base64,')) {
      const parts = base64Image.split(';base64,');
      mimeType = parts[0].split(':')[1] || 'image/jpeg';
      cleanBase64 = parts[1];
    }

    // Validate mime type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException('Invalid image format. Supported: JPEG, PNG, WebP, GIF');
    }

    // ── 4. COMPUTE HASH + CHECK CACHE ────────────────────────────────────────
    const hash = this.md5(cleanBase64);
    const cachedEntry = this.cacheMap.get(hash);

    if (cachedEntry && Date.now() - cachedEntry.timestamp < this.CACHE_TTL_MS) {
      console.log('[SmartSort] Cache hit — reusing previous analysis result');
      // Reuse cached analysis data but still create a new scan record
      return this.saveScanToDb({
        mimeType,
        cleanBase64,
        userId,
        analysis: cachedEntry.data,
      });
    }

    // ── 5. CHECK IN-FLIGHT DEDUP ─────────────────────────────────────────────
    const inflight = this.inflightMap.get(hash);
    if (inflight) {
      console.log('[SmartSort] In-flight dedup — waiting for concurrent request');
      // Await the in-flight request; it will return the Gemini result
      // The other request will also save to DB, so we just wait
      try {
        const analysis = await inflight;
        return this.saveScanToDb({
          mimeType,
          cleanBase64,
          userId,
          analysis,
        });
      } catch {
        // If the in-flight request failed, fall through to try ourselves
        console.log('[SmartSort] In-flight request failed, retrying');
      }
    }

    // ── 6. PREPARE GEMINI PAYLOAD ────────────────────────────────────────────
    const imagePart = {
      inlineData: { data: cleanBase64, mimeType },
    };

    // Shortened prompt — schema is already defined at model level
    const prompt = 'Classify this waste image. Return JSON only.';

    // ── 7. ATTEMPT GEMINI CALL (with retry + timeout + cooldown) ──────────────
    let analysisResult: {
      category: string;
      confidence: number;
      brand: string | null;
      ocrText: string | null;
      ecoScore: number;
      tips: string;
      fromFallback?: boolean;
    } | null = null;

    let geminiSucceeded = false;

    // Check cooldown first — if provider is cooling down, skip straight to fallback
    if (this.isCooldownActive()) {
      console.log('[SmartSort] Cooldown active — using fallback classification');
      analysisResult = {
        ...this.fallbackClassify(null),
        fromFallback: true,
      };
    } else {
      // Acquire semaphore slot
      await this.acquire();

      // Register in-flight promise
      const geminiPromise = (async () => {
        const raw = await this.callGeminiWithRetry(imagePart, prompt);
        return this.parseGeminiResponse(raw);
      })();

      this.inflightMap.set(hash, geminiPromise);

      try {
        const parsed = await geminiPromise;
        analysisResult = parsed as any;
        analysisResult.fromFallback = false;
        geminiSucceeded = true;

        // Populate cache on success
        this.cacheMap.set(hash, {
          data: {
            category: analysisResult.category,
            confidence: analysisResult.confidence,
            brand: analysisResult.brand,
            ocrText: analysisResult.ocrText,
            ecoScore: analysisResult.ecoScore,
            tips: analysisResult.tips,
          },
          timestamp: Date.now(),
        });
      } catch (error: any) {
        console.error('[SmartSort] Gemini call failed:', error?.message || error);

        // Use fallback classification so the app still works when Gemini is down
        // Cooldown was already activated inside callGeminiWithRetry for quota errors
        analysisResult = {
          ...this.fallbackClassify(null),
          fromFallback: true,
        };
      } finally {
        this.inflightMap.delete(hash);
        this.release();
      }
    }

    // If analysisResult is still null (shouldn't happen, but guard)
    if (!analysisResult) {
      analysisResult = {
        ...this.fallbackClassify(null),
        fromFallback: true,
      };
    }

    // ── 8. SAVE TO DATABASE ──────────────────────────────────────────────────
    return this.saveScanToDb({
      mimeType,
      cleanBase64,
      userId,
      analysis: {
        category: analysisResult.category,
        confidence: analysisResult.confidence,
        brand: analysisResult.brand,
        ocrText: analysisResult.ocrText,
        ecoScore: analysisResult.ecoScore,
        tips: analysisResult.tips,
      },
    });
  }

  /**
   * Parse Gemini JSON response — handles markdown fences and malformed JSON.
   */
  private parseGeminiResponse(responseText: string): {
    category: string;
    confidence: number;
    brand: string | null;
    ocrText: string | null;
    ecoScore: number;
    tips: string;
  } {
    console.log('========== GEMINI RESPONSE ==========');
    console.log(responseText);
    console.log('=====================================');

    try {
      let clean = responseText.trim();
      clean = clean.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);

      // Attempt keyword-based salvage if Gemini returned empty category
      const category = (parsed.category || 'OTHERS').toUpperCase();
      const confidence = parseFloat(parsed.confidence) || 0.85;
      const brand = parsed.brand || null;
      const ocrText = parsed.ocrText || null;
      const ecoScore = parseInt(parsed.ecoScore, 10) || 50;
      const tips = parsed.tips || 'Buang di tempat sampah yang sesuai.';

      // If category is OTHERS but we have OCR text, try local fallback
      if (category === 'OTHERS' && ocrText) {
        const fb = this.fallbackClassify(ocrText);
        if (fb.category !== 'OTHERS') {
          return {
            category: fb.category,
            confidence: Math.min(confidence, 0.7),
            brand,
            ocrText,
            ecoScore: fb.ecoScore,
            tips: fb.tips,
          };
        }
      }

      return { category, confidence, brand, ocrText, ecoScore, tips };
    } catch (parseError) {
      console.error('========== JSON PARSE ERROR ==========');
      console.error(parseError);
      console.error('RAW RESPONSE:', responseText);

      // Try to salvage any OCR text from the raw response for fallback
      const fb = this.fallbackClassify(responseText || null);
      return {
        category: fb.category,
        confidence: 0.5,
        brand: null,
        ocrText: responseText || null,
        ecoScore: fb.ecoScore,
        tips: fb.tips,
      };
    }
  }

  /**
   * Save scan result to DB inside a transaction.
   * This is the same logic as before, extracted for reuse by cache + fallback paths.
   */
  private async saveScanToDb(params: {
    mimeType: string;
    cleanBase64: string;
    userId: string;
    analysis: {
      category: string;
      confidence: number;
      brand: string | null;
      ocrText: string | null;
      ecoScore: number;
      tips: string;
    };
  }) {
    const { mimeType, cleanBase64, userId, analysis } = params;
    const { category, confidence, brand, ocrText, ecoScore, tips } = analysis;

    const calculatedPoints = Math.round(ecoScore * 0.1) || 5;

    const scanResult = await this.prisma.$transaction(async (tx) => {
      // 1. Save scan record
      const scan = await tx.scan.create({
        data: {
          userId,
          imageUrl: `data:${mimeType};base64,${cleanBase64}`,
          category,
          confidence,
          brand,
          ecoScore,
          ocrText,
          tips,
        },
      });

      // 2. Increment user's ecoPoints
      await tx.user.update({
        where: { id: userId },
        data: { ecoPoints: { increment: calculatedPoints } },
      });

      // 3. Update AnalyticsSummary
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const carbonReducedIncrement = this.calculateCarbonReduction(category);

      await tx.analyticsSummary.upsert({
        where: { date: today },
        update: {
          totalScans: { increment: 1 },
          plasticScans: category === 'PLASTIC' ? { increment: 1 } : undefined,
          organicScans: category === 'ORGANIC' ? { increment: 1 } : undefined,
          paperScans: category === 'PAPER' ? { increment: 1 } : undefined,
          glassScans: category === 'GLASS' ? { increment: 1 } : undefined,
          electronicScans: category === 'ELECTRONIC' ? { increment: 1 } : undefined,
          metalScans: category === 'METAL' ? { increment: 1 } : undefined,
          carbonReduced: { increment: carbonReducedIncrement },
        },
        create: {
          date: today,
          totalScans: 1,
          plasticScans: category === 'PLASTIC' ? 1 : 0,
          organicScans: category === 'ORGANIC' ? 1 : 0,
          paperScans: category === 'PAPER' ? 1 : 0,
          glassScans: category === 'GLASS' ? 1 : 0,
          electronicScans: category === 'ELECTRONIC' ? 1 : 0,
          metalScans: category === 'METAL' ? 1 : 0,
          carbonReduced: carbonReducedIncrement,
        },
      });

      return scan;
    });

    return {
      message: 'Waste analyzed successfully',
      pointsEarned: calculatedPoints,
      data: scanResult,
    };
  }

  // ─── Existing methods (unchanged) ──────────────────────────────────────────

  async getUserScans(userId: string) {
    return this.prisma.scan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getScanDetail(scanId: string, userId: string) {
    const scan = await this.prisma.scan.findUnique({
      where: { id: scanId },
    });

    if (!scan || scan.userId !== userId) {
      throw new BadRequestException('Scan not found or access denied');
    }

    return scan;
  }

  private calculateCarbonReduction(category: string): number {
    switch (category) {
      case 'PLASTIC':
        return 0.1;
      case 'PAPER':
        return 0.05;
      case 'GLASS':
        return 0.15;
      case 'METAL':
        return 0.25;
      case 'ELECTRONIC':
        return 0.5;
      case 'ORGANIC':
        return 0.02;
      default:
        return 0.01;
    }
  }
}

import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI, Type } from '@google/generative-ai';

@Injectable()
export class ScansService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Configure Gemini 1.5 Flash with structured JSON output schema matching our DB properties
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'The category of the waste. MUST be one of: PLASTIC, ORGANIC, PAPER, GLASS, ELECTRONIC, METAL, OTHERS',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score of the classification, ranging from 0.0 to 1.0',
            },
            brand: {
              type: Type.STRING,
              description: 'The recognized product brand or logo printed on the packaging, or null if none detected by OCR.',
            },
            ocrText: {
              type: Type.STRING,
              description: 'Raw textual content read from the packaging labels or barcodes via OCR, or null if none.',
            },
            ecoScore: {
              type: Type.INTEGER,
              description: 'Environmental friendliness score from 0 to 100 based on recyclability.',
            },
            tips: {
              type: Type.STRING,
              description: 'Detailed, highly practical step-by-step recycling, reuse, or safe disposal recommendations in Indonesian language.',
            },
          },
          required: ['category', 'confidence', 'ecoScore', 'tips'],
        },
      },
      systemInstruction: 'You are SmartSort AI, a professional waste management and recycling vision engine. Analyze the provided image of garbage/waste. Correctly classify its primary material into one of the designated categories. Use OCR capabilities to extract any packaging text or brand names. Provide realistic eco scores (0-100) and actionable, premium recycling suggestions in Indonesian.',
    });
  }

  async detectWaste(base64Image: string, userId: string) {
    if (!base64Image) {
      throw new BadRequestException('Image data is required');
    }

    // 1. SECURITY AUDIT CHECK: Enforce strict image size limit (5MB) to prevent Denial of Service (DoS) memory exhaustion
    const approximateSizeInBytes = base64Image.length * 0.75;
    if (approximateSizeInBytes > 5 * 1024 * 1024) {
      throw new BadRequestException('Image size exceeds the 5MB upload limit');
    }

    // 2. SECURITY AUDIT CHECK: Protect Gemini API key quotas from abuse via database-driven hourly rate limiting
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const recentScansCount = await this.prisma.scan.count({
      where: {
        userId,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (recentScansCount >= 15) {
      throw new BadRequestException('Scan rate limit exceeded (Max 15 scans per hour). Please try again later.');
    }

    try {
      // Parse base64 header
      let mimeType = 'image/jpeg';
      let cleanBase64 = base64Image;

      if (base64Image.includes(';base64,')) {
        const parts = base64Image.split(';base64,');
        mimeType = parts[0].split(':')[1] || 'image/jpeg';
        cleanBase64 = parts[1];
      }

      // Convert to format required by Gemini SDK
      const imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType,
        },
      };

      // Call Gemini 1.5 Flash Multimodal
      const result = await this.model.generateContent([
        'Analyze this waste object. Classify it, perform OCR text reading, evaluate the eco-score, and generate recycling recommendations.',
        imagePart,
      ]);

      const responseText = result.response.text();
      const aiResponse = JSON.parse(responseText);

      // Extract details
      const category = (aiResponse.category || 'OTHERS').toUpperCase();
      const confidence = parseFloat(aiResponse.confidence) || 0.85;
      const brand = aiResponse.brand || null;
      const ocrText = aiResponse.ocrText || null;
      const ecoScore = parseInt(aiResponse.ecoScore) || 50;
      const tips = aiResponse.tips || 'Buang di tempat sampah yang sesuai.';

      // Save scan details and update User ecoPoints + AnalyticsSummary inside a safe database transaction
      const calculatedPoints = Math.round(ecoScore * 0.1) || 5; // e.g. 70 ecoScore gives 7 points

      const scanResult = await this.prisma.$transaction(async (tx) => {
        // 1. Save scan record
        const scan = await tx.scan.create({
          data: {
            userId,
            imageUrl: `data:${mimeType};base64,${cleanBase64}`, // Save image string for visual proof in history
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
          data: {
            ecoPoints: {
              increment: calculatedPoints,
            },
          },
        });

        // 3. Update AnalyticsSummary for near real-time aggregation
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
    } catch (error) {
      console.error('Error during waste detection:', error);
      throw new InternalServerErrorException('AI vision model failed to process the request');
    }
  }

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
    // Basic approximate carbon savings per item recycled in kg of CO2 equivalent
    switch (category) {
      case 'PLASTIC':
        return 0.1; // 100g CO2 saved per plastic bottle
      case 'PAPER':
        return 0.05; // 50g saved
      case 'GLASS':
        return 0.15; // 150g saved
      case 'METAL':
        return 0.25; // 250g saved (highly energy intensive to mine raw metals)
      case 'ELECTRONIC':
        return 0.5;  // 500g saved (toxic material containment & precious metals)
      case 'ORGANIC':
        return 0.02; // Composting instead of landfill methane
      default:
        return 0.01;
    }
  }
}

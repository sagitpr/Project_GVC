import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EDUCATION_CONTENT = [
  {
    title: 'Cara Memilah Sampah Plastik yang Benar',
    category: 'PLASTIC',
    content: `Plastik adalah salah satu jenis sampah yang paling sulit terurai di alam, dengan estimasi waktu penguraian mencapai 400-1000 tahun. Namun, hampir semua jenis plastik dapat didaur ulang jika dipilah dengan benar.

Jenis-Jenis Plastik yang Perlu Kamu Ketahui:

PET (Kode 1) — Biasa untuk botol minuman. Paling mudah didaur ulang. Bilas bersih, lepaskan tutup dan label, pipihkan.

HDPE (Kode 2) — Botol sampo, deterjen, jerigen. Nilai ekonomi baik, sangat mudah didaur ulang.

PP (Kode 5) — Wadah makanan, sedotan, ember. Tahan panas, dapat didaur ulang menjadi serat dan wadah baru.

LDPE (Kode 4) — Kantong plastik, bungkus makanan. Lebih sulit didaur ulang karena fleksibel.

Panduan Memilah Plastik di Rumah:

1. Siapkan wadah khusus untuk sampah plastik
2. Bersihkan sisa makanan — plastik kotor tidak bisa didaur ulang
3. Pisahkan tutup botol (PP) dari badan botol (PET)
4. Pipihkan botol untuk hemat ruang
5. Keringkan sebelum disimpan
6. Kelompokkan berdasarkan warna jika memungkinkan

Tips Penting:
Jangan mencampur plastik dengan sampah organik atau kertas basah
Hindari produk kemasan multilayer (sulit didaur ulang)
Styrofoam dan plastik kresek hitam tidak diterima bank sampah
Satu ton plastik daur ulang menghemat 5.774 kWh energi!`,
  },
  {
    title: 'Membuat Kompos dari Sampah Organik Rumah Tangga',
    category: 'ORGANIC',
    content: `Sampah organik mencakup sekitar 60% dari total sampah rumah tangga di Indonesia. Alih-alih berakhir di TPA yang menghasilkan gas metana berbahaya, sampah organik dapat diolah menjadi kompos yang bermanfaat.

Apa itu Kompos?
Kompos adalah pupuk alami dari proses dekomposisi bahan organik oleh mikroorganisme. Mengubah sisa dapur menjadi tanah kaya nutrisi.

Bahan yang Bisa Dikompos:
Hijau (Nitrogen): Sisa sayuran, kulit buah, ampas kopi, daun teh, rumput segar
Coklat (Karbon): Daun kering, ranting, kertas koran, kardus, sekam padi

Bahan yang TIDAK Bisa Dikompos:
Daging, ikan, tulang (bau dan menarik hama)
Produk susu (keju, yogurt)
Minyak dan lemak
Tanaman berpenyakit

Cara Membuat Kompos di Rumah:

Langkah 1 — Siapkan wadah (keranjang/ember 20-40 liter dengan lubang drainase)
Langkah 2 — Lapisi dasar dengan ranting/sekam 5 cm untuk sirkulasi
Langkah 3 — Tumpuk bergantian: hijau 5-10 cm, coklat 10 cm. Perbandingan 1:2
Langkah 4 — Jaga kelembaban seperti spons diperas
Langkah 5 — Aduk setiap 3-7 hari untuk oksigen
Langkah 6 — Panen setelah 30-60 hari: warna coklat gelap, bau tanah hutan

Manfaat Kompos:
Menyuburkan tanah dan tanaman
Mengurangi kebutuhan pupuk kimia
Memperbaiki struktur tanah
Menahan kelembaban tanah
Mengurangi emisi metana dari TPA`,
  },
  {
    title: 'Proses Daur Ulang Kertas Bekas',
    category: 'PAPER',
    content: `Setiap ton kertas yang didaur ulang menyelamatkan 17 pohon dewasa, menghemat 26.000 liter air, dan mengurangi emisi karbon hingga 1 ton CO2. Di Indonesia, tingkat daur ulang kertas masih sekitar 50%.

Jenis Kertas yang Bisa Didaur Ulang:
Kertas HVS dan dokumen kantor
Kertas koran dan majalah
Kardus dan karton
Kertas pembungkus (tanpa plastik)
Buku dan kertas catatan

Jenis Kertas yang TIDAK Bisa:
Kertas berminyak (pembungkus makanan)
Kertas berlapis plastik atau lilin
Kertas karbon
Tisu basah dan tisu bekas
Kertas thermal (struk belanja)

Proses Daur Ulang Kertas:

1. Pengumpulan & Pemilahan — Kertas dipilah berdasarkan jenis dan kualitas
2. Pencacahan — Dipotong menjadi potongan kecil
3. Pulping — Dicampur air menjadi bubur kertas (pulp)
4. Penyaringan — Memisahkan kontaminan (stapler, lem, plastik)
5. De-inking — Menghilangkan tinta dengan gelembung udara
6. Pemutihan — Dengan hidrogen peroksida (ramah lingkungan)
7. Pembentukan Lembaran — Bubur kertas di atas wire mesh
8. Press & Pengeringan — Dikeringkan drum panas 100-120°C
9. Finishing — Digulung atau dipotong, siap digunakan!

Ide Kreatif di Rumah:
Kertas satu sisi untuk coretan atau print draft
Kardus bekas untuk wadah penyimpanan
Kertas koran untuk paper mache atau pembungkus kado`,
  },
  {
    title: 'Mengelola Sampah Elektronik (E-Waste) dengan Aman',
    category: 'ELECTRONIC',
    content: `Indonesia menghasilkan sekitar 1,8 juta ton sampah elektronik per tahun, hanya kurang dari 10% yang dikelola benar. E-waste mengandung timbal, merkuri, kadmium yang mencemari lingkungan jika dibuang sembarangan.

Apa itu E-Waste?
Handphone, laptop, komputer, tablet, televisi, monitor, kabel, charger, kulkas, AC, mesin cuci, headset, printer, baterai, power bank.

Mengapa E-Waste Berbahaya?
Satu baterai ponsel cemari 600.000 liter air
Tabung TV/ monitor lama mengandung 2-4 kg timbal
Merkuri dari lampu neon rusak saraf dan ginjal
Kadmium dari baterai masuk rantai makanan

Yang HARUS Dilakukan:

1. Pisahkan dari sampah rumah tangga biasa
2. Hapus data pribadi sebelum membuang ponsel/laptop
3. Setor ke drop point resmi e-waste
4. Manfaatkan program tukar tambah di toko elektronik
5. Donasikan jika masih berfungsi ke sekolah atau panti asuhan

Proses Daur Ulang E-Waste:
1. Sortir manual — barang diperiksa, yang masih berfungsi direkondisi
2. Pembongkaran — komponen berbahaya dibongkar manual
3. Penghancuran & Pemisahan — material dipisahkan dengan magnet, eddy current
4. Pemulihan Material — logam mulia (emas, perak) diekstraksi dari papan sirkuit

Tips Mengurangi E-Waste:
Perbaiki daripada ganti — banyak kerusakan ringan bisa diperbaiki
Beli elektronik berkualitas tahan lama
Gunakan hingga benar-benar rusak, jangan tergoda upgrade tahunan`,
  },
  {
    title: 'Memanfaatkan Kembali Botol Kaca Bekas',
    category: 'GLASS',
    content: `Kaca adalah material paling ramah lingkungan karena dapat didaur ulang 100% tanpa kehilangan kualitas. Botol kaca di TPA butuh 1 juta tahun terurai, tapi jika didaur ulang bisa jadi botol baru hanya dalam 30 hari!

Keunggulan Daur Ulang Kaca:
Dapat didaur ulang tanpa batas
Menghemat 20% bahan baku
Mengurangi emisi CO2 sebesar 300 kg per ton
Tidak mengandung bahan kimia berbahaya

Jenis Kaca yang Bisa Didaur Ulang:
Botol minuman (bir, wine, soda)
Botol saus dan kecap
Toples makanan
Botol parfum (kosong)

Jenis Kaca yang TIDAK Bisa:
Kaca pyrex / ovenware (titik leleh berbeda)
Kaca lampu (mengandung logam)
Cermin (lapisan reflektif)
Kaca mobil (berlapis laminate)
Gelas keramik atau porselen

Proses Daur Ulang Kaca:
1. Koleksi & Sortir — dipilah berdasarkan warna (bening, hijau, coklat)
2. Pembersihan — label dan tutup dibersihkan
3. Penghancuran — dihancurkan menjadi cullet (1-5 cm)
4. Pencampuran — cullet dicampur pasir silika, soda abu, batu kapur
5. Peleburan — suhu 1400-1600°C, cullet turunkan suhu leleh
6. Pembentukan — dibentuk dengan cetakan
7. Annealing — didinginkan perlahan agar tidak mudah pecah

Ide Kreatif Menggunakan Ulang Botol Kaca:
Vas bunga dari botol wine
Tempat lilin tealight
Decanter minyak goreng
Pot tanaman hias gantung
Dekorasi lampu peri dan hiasan`,
  },
  {
    title: 'Daur Ulang Logam: Aluminium dan Baja',
    category: 'METAL',
    content: `Logam adalah material paling efisien untuk didaur ulang. Aluminium dapat didaur ulang tanpa kehilangan kualitas, hanya butuh 5% energi dibanding produksi baru dari bijih bauksit. Satu kaleng aluminium bisa daur ulang dan kembali ke rak dalam 60 hari!

Mengapa Daur Ulang Logam Penting?
Aluminium daur ulang hemat 95% energi
Baja daur ulang hemat 65% energi
Tembaga daur ulang hemat 85% energi
1 ton aluminium daur ulang kurangi 9 ton CO2 (setara tidak nyetir 2 tahun!)
Setiap ton baja daur ulang selamatkan 1,1 ton bijih besi

Jenis Logam yang Bisa Didaur Ulang:
Aluminium: Kaleng minuman, foil, bingkai jendela
Baja: Kaleng makanan, peralatan dapur, rangka bangunan
Tembaga: Kabel listrik, pipa air, motor listrik
Kuningan: Kran air, alat musik, fitting pipa

Cara Memilah Logam di Rumah:
1. Kaleng aluminium — bilas, pipihkan, kumpulkan
2. Kaleng makanan — bersihkan sisa makanan, keringkan
3. Kabel bekas — kumpulkan terpisah
4. Peralatan dapur rusak — wajan, panci, sendok logam

Fakta Menarik:
Kaleng aluminium bertahan 200-500 tahun di TPA
Setiap menit 100.000 kaleng aluminium didaur ulang dunia
Baja adalah material paling banyak didaur ulang di dunia
Sebuah mobil mengandung 65% baja dan 8% aluminium yang bisa didaur ulang`,
  },
  {
    title: 'Panduan Lengkap Zero Waste untuk Pemula',
    category: 'COMPOSTING',
    content: `Zero Waste adalah gaya hidup mengurangi sampah ke TPA hingga seminimal mungkin. Dipopulerkan Bea Johnson melalui "Zero Waste Home", kini menjadi gerakan global.

5 Prinsip Zero Waste (5R):

1. Refuse (Tolak)
Tolak barang sekali pakai: sedotan plastik, kantong plastik, styrofoam.
Tips: Bawa tas belanja sendiri, tolak sedotan, bawa botol minum isi ulang.

2. Reduce (Kurangi)
Kurangi konsumsi barang tidak perlu. Beli berkualitas tahan lama.
Tips: Belanja bulk kurangi kemasan, pilih produk tanpa kemasan, pinjam barang jarang dipakai.

3. Reuse (Gunakan Ulang)
Gunakan barang berkali-kali, pilih reusable daripada disposable.
Tips: Botol minum stainless, sendok garpu sendiri, kain lap ganti tisu, stoples kaca untuk makanan.

4. Recycle (Daur Ulang)
Langkah terakhir sebelum pembuangan. Pastikan bersih dan terpilah.
Tips: Pelajari aturan daur ulang kota Anda, pilah per kategori, setor ke bank sampah.

5. Rot (Membusukkan)
Olah sisa makanan jadi kompos, kembalikan nutrisi ke tanah.
Tips: Mulai komposter rumah, metode bokashi untuk apartemen.

30 Hari Tantangan Zero Waste:

Minggu 1 — Dapur: Bawa tas belanja, botol minum, tolak sedotan, bawa wadah bekal, buat komposter
Minggu 2 — Kamar Mandi: Sabun batang ganti sabun cair, sikat gigi bambu, pembersih alami (cuka + baking soda)
Minggu 3 — Lemari: Jual/donasi/upcycle pakaian tidak terpakai, beli second hand
Minggu 4 — Gaya Hidup: Bawa alat makan sendiri, hindari air kemasan, tolak goodie bag`,
  },
  {
    title: 'Smart City: Masa Depan Pengelolaan Sampah',
    category: 'SMART_CITY',
    content: `Smart Waste Management adalah sistem pengelolaan sampah yang mengintegrasikan IoT, AI, Big Data, dan platform digital. Dengan populasi perkotaan bertambah, metode konvensional tidak lagi mencukupi.

Teknologi Utama:

1. Sensor IoT pada Tempat Sampah
Sensor ultrasonik pantau tingkat kepenuhan real-time. Ketika 80% penuh, kirim sinyal untuk penjadwalan angkut. Hasilnya: rute dioptimalkan, kurangi perjalanan truk 40%, hemat bahan bakar.

2. AI untuk Klasifikasi & Sortir
Kamera dan AI vision di pusat sortir untuk identifikasi otomatis. Kenali 100+ jenis material, pisahkan dengan akurasi >95%, bekerja 24/7.

3. Platform Digital & Aplikasi
Aplikasi seperti SMARTSORT hubungkan masyarakat dengan ekosistem: edukasi pemilahan, lokasi drop point, jadwal pickup, tracking dampak, reward.

4. Optimalisasi Rute dengan AI
Algoritma analisis data historis untuk rute paling efisien. Truk hanya ke tempat yang perlu dikosongkan, hemat biaya operasional 30%.

5. Digital Twin & Predictive Analytics
Replika virtual sistem untuk prediksi volume sampah, simulasi krisis, perencanaan investasi.

Contoh Implementasi Global:
Seoul — Sistem RFID setiap kantong sampah, pay-as-you-throw
Barcelona — Tempat sampah underground dengan IoT, pipa bawah tanah
San Francisco — Target Zero Waste 2030, 3-wadah + AI sortir
Surabaya — Bank sampah digital terintegrasi Dinas Kebersihan

Partisipasi Masyarakat:
Gunakan SMARTSORT untuk scan sampah sebelum buang
Lapor tempat sampah penuh via platform smart city
Ikut bank sampah digital
Partisipasi challenge lingkungan`,
  },
];

async function main() {
  console.log('🌱 Seeding Education Content...');

  for (const item of EDUCATION_CONTENT) {
    const existing = await prisma.educationContent.findFirst({
      where: { title: item.title },
    });
    if (existing) {
      await prisma.educationContent.update({
        where: { id: existing.id },
        data: { content: item.content, category: item.category },
      });
    } else {
      await prisma.educationContent.create({
        data: {
          title: item.title,
          category: item.category,
          content: item.content,
        },
      });
    }
    console.log(`  ✅ ${item.title}`);
  }

  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

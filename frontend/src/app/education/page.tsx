'use client';

import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Search, Leaf, Recycle, Factory, 
  Lightbulb, ChevronRight, Clock, Loader2,
  ArrowLeft, GraduationCap, FileText, Play,
  BookmarkPlus, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { educationApi } from '../../lib/api';

const CATEGORY_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  PLASTIC:     { icon: Recycle,   color: 'text-sky-600',   bg: 'bg-sky-50' },
  ORGANIC:     { icon: Leaf,      color: 'text-emerald-600', bg: 'bg-emerald-50' },
  PAPER:       { icon: FileText,  color: 'text-amber-600',  bg: 'bg-amber-50' },
  GLASS:       { icon: Lightbulb, color: 'text-teal-600',   bg: 'bg-teal-50' },
  METAL:       { icon: Factory,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ELECTRONIC:  { icon: Recycle,   color: 'text-purple-600', bg: 'bg-purple-50' },
  COMPOSTING:  { icon: Leaf,      color: 'text-emerald-600', bg: 'bg-emerald-50' },
  SMART_CITY:  { icon: GraduationCap, color: 'text-cyan-600', bg: 'bg-cyan-50' },
};

// ─── Rich Educational Content (Fallback data when API unavailable) ───────
const EDU_CONTENT: EduArticle[] = [
  {
    id: '1', category: 'PLASTIC',
    title: 'Cara Memilah Sampah Plastik yang Benar',
    content: `Plastik adalah salah satu jenis sampah yang paling sulit terurai di alam, dengan estimasi waktu penguraian mencapai 400-1000 tahun. Namun, hampir semua jenis plastik dapat didaur ulang jika dipilah dengan benar. Memilah sampah plastik dengan tepat adalah langkah pertama yang krusial dalam siklus daur ulang.

**Jenis-Jenis Plastik yang Perlu Kamu Ketahui:**

**1. PET (Polyethylene Terephthalate) — Kode 1**
Biasa digunakan untuk botol air mineral, botol minuman, dan kemasan saus. PET adalah jenis plastik yang paling mudah didaur ulang dan memiliki nilai jual tertinggi di bank sampah. Botol PET bekas dapat diolah kembali menjadi serat polyester untuk pakaian, karpet, atau bahkan botol baru.

**Cara memilah:** Bilas hingga bersih, lepaskan tutup dan label, pipihkan untuk menghemat ruang penyimpanan.

**2. HDPE (High-Density Polyethylene) — Kode 2**
Digunakan untuk botol sampo, botol deterjen, jerigen, dan tutup botol. HDPE juga sangat mudah didaur ulang dan memiliki nilai ekonomi yang baik.

**3. PP (Polypropylene) — Kode 5**
Ditemukan pada wadah makanan, sedotan, ember, dan kursi plastik. PP tahan terhadap panas dan dapat didaur ulang menjadi serat dan wadah baru.

**4. LDPE (Low-Density Polyethylene) — Kode 4**
Kantong plastik, bungkus makanan, dan plastik kemasan ringan. LDPE lebih sulit didaur ulang karena sifatnya yang fleksibel, namun beberapa bank sampah sudah mulai menerimanya.

**Panduan Memilah Plastik di Rumah:**

1. Siapkan wadah atau karung terpisah khusus untuk sampah plastik
2. Bersihkan sisa makanan atau minuman — plastik kotor tidak dapat didaur ulang
3. Pisahkan tutup botol (biasanya PP) dari badan botol (biasanya PET) karena jenisnya berbeda
4. Pipihkan botol dan kemasan untuk menghemat ruang
5. Keringkan sebelum disimpan — plastik basah dapat berjamur dan menurunkan kualitas
6. Kelompokkan berdasarkan warna jika memungkinkan (bening, warna, gelap)

**Tips Penting:**
✓ Jangan mencampur plastik dengan sampah organik atau kertas basah
✓ Hindari membeli produk dengan kemasan multilayer (sulit didaur ulang)
✓ Styrofoam dan plastik kresek hitam umumnya tidak diterima bank sampah
✓ Satu ton plastik yang didaur ulang menghemat hingga 5.774 kWh energi — cukup untuk menyalakan 500 rumah selama sehari!`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
  {
    id: '2', category: 'ORGANIC',
    title: 'Membuat Kompos dari Sampah Organik Rumah Tangga',
    content: `Sampah organik mencakup sekitar 60% dari total sampah rumah tangga di Indonesia. Alih-alih berakhir di Tempat Pembuangan Akhir (TPA) yang menghasilkan gas metana berbahaya, sampah organik dapat diolah menjadi kompos yang bermanfaat bagi tanaman dan tanah.

**Apa itu Kompos?**
Kompos adalah pupuk alami yang dihasilkan dari proses dekomposisi bahan organik oleh mikroorganisme. Proses ini mengubah sisa dapur dan halaman menjadi tanah kaya nutrisi yang sangat baik untuk tanaman.

**Bahan yang Bisa Dikompos:**

✓ **Hijau (Kaya Nitrogen):** Sisa sayuran, kulit buah, ampas kopi, daun teh, rumput segar
✓ **Coklat (Kaya Karbon):** Daun kering, ranting, kertas koran, kardus, sekam padi

**Bahan yang TIDAK Bisa Dikompos:**
✗ Daging, ikan, tulang (menimbulkan bau dan menarik hama)
✗ Produk susu (keju, yogurt)
✗ Minyak dan lemak
✗ Tanaman berpenyakit

**Cara Membuat Kompos di Rumah (Metode Keranjang):**

**Langkah 1: Siapkan Wadah**
Gunakan keranjang atau ember bekas dengan lubang drainase di bagian bawah. Ukuran ideal: 20-40 liter untuk rumah tangga kecil.

**Langkah 2: Lapisi Dasar**
Letakkan ranting kecil atau sekam padi setebal 5 cm sebagai alas untuk sirkulasi udara.

**Langkah 3: Tumpuk Bergantian**
Lapisan hijau (sisa dapur) setebal 5-10 cm, lalu lapisan coklat (daun kering/kertas) setebal 10 cm. Ulangi terus hingga wadah penuh. Perbandingan ideal: 1 bagian hijau : 2 bagian coklat.

**Langkah 4: Jaga Kelembaban**
Kompos yang baik memiliki kelembaban seperti spons diperas — lembab tapi tidak basah. Jika terlalu kering, semprot dengan air. Jika terlalu basah, tambahkan bahan coklat.

**Langkah 5: Aduk Secara Rutin**
Aduk kompos setiap 3-7 hari untuk memberikan oksigen bagi mikroorganisme. Semakin sering diaduk, semakin cepat proses pengomposan.

**Langkah 6: Panen!**
Setelah 30-60 hari, kompos siap dipanen. Cirinya: berwarna coklat gelap, berbau seperti tanah hutan, tekstur remah, dan suhu sudah dingin.

**Manfaat Kompos:**
🌱 Menyuburkan tanah dan tanaman
🌱 Mengurangi kebutuhan pupuk kimia
🌱 Memperbaiki struktur tanah
🌱 Menahan kelembaban tanah
🌱 Mengurangi emisi gas metana dari TPA

**Tips Sukses:**
✓ Letakkan wadah kompos di tempat teduh
✓ Potong bahan menjadi potongan kecil untuk mempercepat proses
✓ Jika ada bau busuk, tambahkan bahan coklat dan aduk
✓ Jika ada semut, kompos terlalu kering — semprot dengan air`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
  {
    id: '3', category: 'PAPER',
    title: 'Proses Daur Ulang Kertas Bekas',
    content: `Setiap ton kertas yang didaur ulang dapat menyelamatkan 17 pohon dewasa, menghemat 26.000 liter air, dan mengurangi emisi karbon hingga 1 ton CO2. Di Indonesia, tingkat daur ulang kertas masih sekitar 50%, artinya masih ada potensi besar untuk meningkatkan partisipasi masyarakat.

**Jenis Kertas yang Bisa Didaur Ulang:**

✓ Kertas HVS dan dokumen kantor
✓ Kertas koran dan majalah
✓ Kardus dan karton
✓ Kertas pembungkus (yang tidak berlapis plastik)
✓ Buku dan kertas catatan
✓ Amplop (tanpa jendela plastik)

**Jenis Kertas yang TIDAK Bisa Didaur Ulang:**
✗ Kertas berminyak (pembungkus makanan)
✗ Kertas berlapis plastik atau lilin
✗ Kertas karbon
✗ Tisu basah dan tisu bekas
✗ Kertas dinding
✗ Kertas thermal (struk belanja)

**Proses Daur Ulang Kertas Langkah demi Langkah:**

**1. Pengumpulan & Pemilahan**
Kertas bekas dikumpulkan dari rumah tangga, kantor, dan industri, kemudian dipilah berdasarkan jenis dan kualitasnya. Kertas yang berbeda memerlukan proses pengolahan yang berbeda.

**2. Pencacahan**
Kertas dipotong menjadi potongan kecil (confetti) untuk mempermudah proses pelarutan. Mesin pencacah khusus digunakan pada tahap ini.

**3. Pulping — Mengubah Kertas Menjadi Bubur**
Potongan kertas dicampur dengan air dalam mesin pulper yang berputar cepat. Proses ini memisahkan serat selulosa dari kertas dan mengubahnya menjadi bubur kertas (pulp). Suhu dan waktu pulping disesuaikan dengan jenis kertas.

**4. Penyaringan & Pembersihan**
Bubur kertas disaring untuk memisahkan kontaminan seperti stapler, lem, plastik, dan tinta. Proses flotasi dan sentrifugasi digunakan untuk membersihkan serat.

**5. De-inking (Penghilangan Tinta)**
Tinta dipisahkan dari serat menggunakan bahan kimia dan gelembung udara dalam proses yang disebut flotasi. Gelembung mengikat partikel tinta dan membawanya ke permukaan untuk dibuang.

**6. Pemutihan (Opsional)**
Untuk menghasilkan kertas putih, bubur kertas diputihkan menggunakan hidrogen peroksida atau oksigen. Proses ini ramah lingkungan dibandingkan pemutihan klorin tradisional.

**7. Pembentukan Lembaran**
Bubur kertas dituangkan ke wire mesh yang bergerak. Air mulai terkuras dan serat mulai saling mengikat membentuk lembaran kertas basah.

**8. Press & Pengeringan**
Lembaran kertas basah ditekan dengan roller untuk mengeluarkan air, kemudian dikeringkan dengan drum panas bersuhu 100-120°C.

**9. Finishing**
Kertas digulung atau dipotong sesuai ukuran, siap untuk digunakan kembali!

**Ide Kreatif Mendaur Ulang Kertas di Rumah:**
📄 Kertas bekas satu sisi bisa digunakan sebagai kertas coretan atau print draft
📄 Kardus bekas bisa menjadi wadah penyimpanan atau mainan anak
📄 Kertas koran bisa menjadi bahan baku paper mache atau pembungkus kado ramah lingkungan
📄 Kertas bekas bisa dijadikan amplop atau kartu ucapan handmade`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
  {
    id: '4', category: 'ELECTRONIC',
    title: 'Mengelola Sampah Elektronik (E-Waste) dengan Aman',
    content: `Indonesia menghasilkan sekitar 1,8 juta ton sampah elektronik (e-waste) per tahun, namun hanya kurang dari 10% yang dikelola dengan benar. E-waste mengandung bahan berbahaya seperti timbal, merkuri, kadmium, dan brominated flame retardants yang dapat mencemari tanah dan air jika dibuang sembarangan.

**Apa itu E-Waste?**
E-waste adalah barang elektronik yang sudah tidak terpakai atau rusak, termasuk:

📱 Handphone dan smartphone
💻 Laptop, komputer, dan tablet
📺 Televisi dan monitor
🔌 Kabel dan charger
🧺 Kulkas, AC, dan mesin cuci
🎧 Headset, speaker, dan perangkat audio
🖨️ Printer dan scanner
🔋 Baterai dan power bank

**Mengapa E-Waste Berbahaya?**

⚠️ Satu baterai ponsel dapat mencemari 600.000 liter air
⚠️ Tabung sinar katoda (TV/ monitor lama) mengandung 2-4 kg timbal
⚠️ Merkuri dari lampu neon dapat menyebabkan kerusakan saraf dan ginjal
⚠️ Kadmium dari baterai dapat mengakumulasi di tanah dan masuk ke rantai makanan

**Yang HARUS Dilakukan:**

1. **Pisahkan dari Sampah Rumah Tangga** — E-waste tidak boleh dicampur dengan sampah biasa karena mengandung bahan berbahaya.

2. **Hapus Data Pribadi** — Sebelum membuang ponsel atau laptop, pastikan semua data pribadi telah dihapus dan factory reset dilakukan.

3. **Setor ke Drop Point Resmi** — Banyak produsen elektronik memiliki program take-back. Cari lokasi drop point e-waste terdekat melalui aplikasi atau hubungi dinas lingkungan setempat.

4. **Manfaatkan Program Tukar Tambah** — Beberapa toko elektronik menerima ponsel dan laptop lama untuk ditukar dengan diskon pembelian baru.

5. **Donasikan jika Masih Berfungsi** — Elektronik yang masih berfungsi bisa didonasikan ke sekolah, panti asuhan, atau komunitas yang membutuhkan.

**Proses Daur Ulang E-Waste:**

**1. Sortir Manual** — Barang diperiksa satu per satu. Yang masih berfungsi direkondisi, yang rusak masuk ke jalur daur ulang.

**2. Pembongkaran** — Komponen berbahaya (baterai, kapasitor, merkuri) dibongkar secara manual untuk ditangani secara khusus.

**3. Penghancuran & Pemisahan** — Sisa material dihancurkan dan dipisahkan menggunakan magnet (untuk logam besi), eddy current (untuk aluminium dan tembaga), dan density separator (untuk plastik).

**4. Pemulihan Material** — Logam mulia seperti emas, perak, dan paladium dari papan sirkuit diekstraksi menggunakan proses kimia khusus. Plastik dari casing elektronik diolah kembali menjadi bijih plastik.

**Tips Mengurangi E-Waste:**
✓ Perbaiki daripada ganti — banyak kerusakan ringan yang bisa diperbaiki
✓ Beli elektronik berkualitas dan tahan lama
✓ Gunakan hingga benar-benar rusak — jangan tergoda upgrade setiap tahun
✓ Hindari membeli charger dan kabel murah yang cepat rusak
✓ Dukung brand yang memiliki program daur ulang produk mereka`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
  {
    id: '5', category: 'GLASS',
    title: 'Memanfaatkan Kembali Botol Kaca Bekas',
    content: `Kaca adalah salah satu material yang paling ramah lingkungan karena dapat didaur ulang 100% tanpa kehilangan kualitas atau kemurniannya. Botol kaca yang dibuang ke TPA membutuhkan waktu 1 juta tahun untuk terurai, namun jika didaur ulang, kaca bekas dapat menjadi botol baru hanya dalam 30 hari!

**Keunggulan Daur Ulang Kaca:**

🟢 Dapat didaur ulang tanpa batas — tidak seperti plastik yang kualitasnya menurun
🟢 Menghemat 20% bahan baku dibandingkan membuat kaca baru
🟢 Mengurangi emisi CO2 sebesar 300 kg per ton kaca daur ulang
🟢 Tidak mengandung bahan kimia berbahaya yang dapat mencemari lingkungan

**Jenis Kaca yang Bisa Didaur Ulang:**
✓ Botol minuman (bir, wine, soda)
✓ Botol saus dan kecap
✓ Toples makanan
✓ Botol parfum (kosong)

**Jenis Kaca yang TIDAK Bisa Didaur Ulang:**
✗ Kaca pyrex atau ovenware (tahan panas — titik leleh berbeda)
✗ Kaca lampu (mengandung logam)
✗ Cermin (lapisan reflektif terkontaminasi)
✗ Kaca mobil (berlapis laminate)
✗ Gelas keramik atau porselen

**Proses Daur Ulang Kaca:**

1. **Koleksi & Sortir** — Kaca dikumpulkan dan dipilah berdasarkan warna (bening, hijau, coklat). Warna harus seragam karena mempengaruhi warna produk akhir.

2. **Pembersihan** — Label, tutup logam, dan sisa cairan dibersihkan. Kontaminasi sekecil apapun dapat merusak kualitas kaca daur ulang.

3. **Penghancuran (Crushing)** — Kaca dihancurkan menjadi pecahan kecil yang disebut cullet. Ukuran cullet yang ideal adalah 1-5 cm.

4. **Pencampuran** — Cullet dicampur dengan bahan baku (pasir silika, soda abu, batu kapur) dengan perbandingan tertentu. Semakin tinggi persentase cullet, semakin hemat energi.

5. **Peleburan** — Campuran dilelehkan pada suhu 1400-1600°C. Penggunaan cullet menurunkan suhu leleh sehingga menghemat energi hingga 30%.

6. **Pembentukan** — Lelehan kaca dibentuk menjadi botol atau produk baru menggunakan cetakan.

7. **Annealing** — Produk kaca didinginkan secara perlahan untuk menghilangkan tegangan internal agar tidak mudah pecah.

**Ide Kreatif Menggunakan Ulang Botol Kaca:**

🏺 Vas bunga — botol wine atau bir bisa menjadi vas bunga rustic
🕯️ Tempat lilin — botol kaca bening untuk lilin tealight
🍶 Decanter minyak — botol bekas untuk menyimpan minyak goreng atau minyak zaitun
🏡 Pot tanaman — botol besar untuk tanaman hias gantung
🎄 Dekorasi — botol bekas bisa dicat dan dijadikan hiasan Natal atau lampu peri`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
  {
    id: '6', category: 'METAL',
    title: 'Daur Ulang Logam: Aluminium dan Baja',
    content: `Logam adalah salah satu material yang paling efisien untuk didaur ulang. Aluminium dapat didaur ulang berkali-kali tanpa kehilangan kualitas, dan prosesnya hanya membutuhkan 5% energi dibandingkan memproduksi aluminium baru dari bijih bauksit. Bayangkan — satu kaleng aluminium bekas dapat didaur ulang dan kembali ke rak toko hanya dalam 60 hari!

**Mengapa Daur Ulang Logam Sangat Penting?**

🔴 **Penghematan Energi:**
- Aluminium daur ulang menghemat 95% energi dibandingkan produksi baru
- Baja daur ulang menghemat 65% energi
- Tembaga daur ulang menghemat 85% energi

🔴 **Pengurangan Emisi:**
Daur ulang 1 ton aluminium mengurangi emisi CO2 hingga 9 ton — setara dengan tidak mengendarai mobil selama 2 tahun!

🔴 **Konservasi Sumber Daya:**
Setiap ton baja daur ulang menyelamatkan 1,1 ton bijih besi, 630 kg batu bara, dan 54 kg batu kapur.

**Jenis Logam yang Bisa Didaur Ulang:**

🥫 **Aluminium:** Kaleng minuman, foil makanan, bingkai jendela, bagian otomotif
🥫 **Baja:** Kaleng makanan, peralatan dapur, rangka bangunan, badan mobil
🥫 **Tembaga:** Kabel listrik, pipa air, motor listrik
🥫 **Kuningan:** Kran air, alat musik, fitting pipa
🥫 **Timah:** Kaleng kemasan makanan (tinplate)

**Cara Memilah Logam di Rumah:**

1. Kaleng minuman aluminium — bilas, pipihkan, kumpulkan
2. Kaleng makanan (sarden, kornet) — bersihkan sisa makanan, keringkan
3. Kabel bekas — kumpulkan terpisah, potong jika panjang
4. Peralatan dapur rusak — wajan, panci, sendok logam
5. Pipa dan fitting — kran bekas, sambungan pipa

**Fakta Menarik:**
♻️ Kaleng aluminium yang tidak didaur ulang akan bertahan di TPA selama 200-500 tahun
♻️ Setiap menit, 100.000 kaleng aluminium didaur ulang di seluruh dunia
♻️ Baja adalah material yang paling banyak didaur ulang di dunia (lebih dari semua material lain digabungkan)
♻️ Sebuah mobil mengandung sekitar 65% baja dan 8% aluminium yang semuanya dapat didaur ulang`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
  {
    id: '7', category: 'COMPOSTING',
    title: 'Panduan Lengkap Zero Waste untuk Pemula',
    content: `Zero Waste adalah gaya hidup yang bertujuan untuk mengurangi jumlah sampah yang dikirim ke TPA hingga seminimal mungkin, bahkan idealnya nol. Konsep ini dipopulerkan oleh Bea Johnson melalui bukunya "Zero Waste Home" dan kini telah menjadi gerakan global.

**5 Prinsip Zero Waste (5R):**

**♻️ 1. Refuse (Tolak)**
Tolak barang-barang sekali pakai yang tidak perlu. Katakan tidak pada sedotan plastik, kantong plastik, kemasan styrofoam, dan brosur. Ini adalah langkah paling efektif karena mencegah sampah sejak awal.

**Tips praktis:**
✓ Bawa tas belanja sendiri
✓ Tolak sedotan saat memesan minuman
✓ Gunakan botol minum isi ulang
✓ Bawa wadah sendiri saat membeli makanan

**♻️ 2. Reduce (Kurangi)**
Kurangi konsumsi barang yang tidak benar-benar dibutuhkan. Beli barang berkualitas yang tahan lama, bukan barang murah yang cepat rusak.

**Tips praktis:**
✓ Belanja dalam jumlah besar (bulk) untuk mengurangi kemasan
✓ Pilih produk dengan kemasan minimal atau tanpa kemasan
✓ Pinjam atau sewa barang yang jarang digunakan
✓ Beli pakaian second hand atau vintage

**♻️ 3. Reuse (Gunakan Ulang)**
Gunakan barang berkali-kali alih-alih membeli yang baru. Pilih produk yang dapat digunakan ulang (reusable) daripada sekali pakai (disposable).

**Tips praktis:**
✓ Gunakan botol minum stainless steel atau kaca
✓ Bawa sendok garpu sendiri
✓ Gunakan kain lap sebagai pengganti tisu
✓ Manfaatkan stoples kaca untuk menyimpan makanan
✓ Perbaiki barang yang rusak daripada membeli baru

**♻️ 4. Recycle (Daur Ulang)**
Daur ulang adalah langkah terakhir sebelum pembuangan. Pastikan barang yang didaur ulang sudah bersih dan dipilah dengan benar.

**Tips praktis:**
✓ Pelajari aturan daur ulang di kota Anda
✓ Pilah sampah sesuai kategori (plastik, kertas, logam, kaca, organik)
✓ Setorkan sampah anorganik ke bank sampah terdekat
✓ Olah sampah organik menjadi kompos

**♻️ 5. Rot (Membusukkan)**
Sisa makanan dan sampah organik diolah kembali ke bumi melalui pengomposan. Ini mengembalikan nutrisi ke tanah dan mengurangi emisi metana dari TPA.

**Tips praktis:**
✓ Mulai komposter di rumah untuk sisa dapur
✓ Gunakan metode bokashi untuk apartemen
✓ Ikut program kompos komunal jika ada di lingkungan Anda

**30 Hari Tantangan Zero Waste:**

**Minggu 1 — Dapur:**
- Hari 1: Bawa tas belanja sendiri
- Hari 2: Bawa botol minum
- Hari 3: Tolak sedotan
- Hari 4: Mulai bawa wadah bekal
- Hari 5: Beli buah dan sayur tanpa kemasan
- Hari 6: Buat komposter sederhana
- Hari 7: Masak sendiri untuk menghindari kemasan

**Minggu 2 — Kamar Mandi:**
- Ganti sabun cair dengan sabun batang
- Ganti sikat gigi plastik dengan yang bambu
- Buat pembersih rumah sendiri dari cuka dan baking soda
- Ganti pembalut sekali pakai dengan pembalut kain atau menstrual cup

**Minggu 3 — Lemari Pakaian:**
- Audit lemari: jual, donasi, atau upcycle pakaian yang tidak terpakai
- Beli pakaian second hand
- Perbaiki pakaian yang rusak

**Minggu 4 — Gaya Hidup:**
- Bawa alat makan sendiri saat bepergian
- Hindari membeli air kemasan
- Refuse barang gratis yang tidak perlu (goodie bag, brosur)
- Ajak teman dan keluarga untuk ikut!`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
  {
    id: '8', category: 'SMART_CITY',
    title: 'Smart City: Masa Depan Pengelolaan Sampah',
    content: `Konsep Smart City tidak hanya tentang lampu jalan pintar atau kamera pengawas — salah satu aspek terpentingnya adalah pengelolaan sampah cerdas (Smart Waste Management). Dengan populasi perkotaan yang terus bertambah, metode pengelolaan sampah konvensional tidak lagi mencukupi. Di sinilah teknologi mengambil peran.

**Apa itu Smart Waste Management?**
Smart Waste Management adalah sistem pengelolaan sampah yang mengintegrasikan Internet of Things (IoT), Artificial Intelligence (AI), Big Data, dan platform digital untuk mengoptimalkan setiap tahap — dari pengumpulan hingga pengolahan akhir.

**Teknologi Utama dalam Smart Waste Management:**

**📡 1. Sensor IoT pada Tempat Sampah**
Tempat sampah pintar dilengkapi sensor ultrasonik yang memantau tingkat kepenuhan secara real-time. Ketika hampir penuh (biasanya 80%), sensor mengirim sinyal ke pusat kontrol untuk menjadwalkan pengangkutan. Hasilnya:
- Rute pengangkutan dioptimalkan secara dinamis
- Mengurangi perjalanan truk sampah hingga 40%
- Menghemat bahan bakar dan emisi kendaraan
- Mencegah tempat sampah meluap di jalanan

**🧠 2. AI untuk Klasifikasi & Sortir**
Kamera dan AI vision (seperti yang digunakan SMARTSORT) ditempatkan di pusat sortir untuk mengidentifikasi dan memilah sampah secara otomatis. Sistem dapat:
- Mengenali lebih dari 100 jenis material
- Memisahkan plastik, kertas, logam dengan akurasi >95%
- Mendeteksi kontaminan yang seharusnya tidak ada
- Bekerja 24/7 tanpa lelah

**🌐 3. Platform Digital & Aplikasi**
Aplikasi seperti SMARTSORT menghubungkan masyarakat dengan ekosistem pengelolaan sampah:
- Edukasi pemilahan sampah
- Lokasi drop point dan bank sampah terdekat
- Penjadwalan pickup
- Tracking dampak lingkungan personal
- Reward dan gamifikasi

**🚛 4. Optimalisasi Rute dengan AI**
Algoritma AI menganalisis data historis dan real-time untuk menentukan rute pengangkutan sampah paling efisien. Truk sampah hanya pergi ke tempat yang benar-benar perlu dikosongkan, menghemat biaya operasional hingga 30%.

**5. Digital Twin & Predictive Analytics**
Kota-kota maju menggunakan digital twin — replika virtual sistem pengelolaan sampah — untuk:
- Memprediksi volume sampah berdasarkan musim, hari libur, dan acara
- Mensimulasikan skenario penanganan krisis
- Merencanakan investasi infrastruktur

**Contoh Implementasi di Dunia:**

🏙️ **Seoul, Korea Selatan** — Sistem pembuangan sampah berbasis RFID. Setiap kantong sampah memiliki chip yang mencatat volume dan jenis sampah per rumah tangga. Sistem pay-as-you-throw: semakin banyak sampah, semakin besar biaya yang dibayar.

🏙️ **Barcelona, Spanyol** — Tempat sampah underground dengan sensor IoT yang terhubung ke pusat kontrol. Truk sampah vacuums mengambil sampah melalui pipa bawah tanah — tidak ada truk sampah di jalan!

🏙️ **San Francisco, AS** — Target Zero Waste 2030 dengan sistem 3-wadah (kompos, daur ulang, residu) dan AI-assisted sortir di pusat pengolahan.

🏙️ **Surabaya, Indonesia** — Program bank sampah digital dan aplikasi pengaduan sampah yang terintegrasi dengan Dinas Kebersihan.

**Bagaimana Masyarakat Bisa Berpartisipasi?**

1. Gunakan aplikasi seperti SMARTSORT untuk scan sampah sebelum dibuang
2. Laporkan tempat sampah penuh melalui platform smart city
3. Ikut program bank sampah digital
4. Partisipasi dalam challenge lingkungan berbasis aplikasi
5. Beri masukan untuk pengembangan kebijakan pengelolaan sampah kota`, imageUrl: null, videoUrl: null, createdAt: new Date().toISOString() },
];

type EduArticle = {
  id: string;
  category: string;
  title: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
};

const CATEGORIES = ['PLASTIC', 'ORGANIC', 'PAPER', 'GLASS', 'METAL', 'ELECTRONIC', 'COMPOSTING', 'SMART_CITY'];

export default function EducationPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [readingContent, setReadingContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await educationApi.getByCategory();
      if (data && data.length > 0) {
        setContent(data);
      } else {
        setContent(EDU_CONTENT);
      }
    } catch {
      // Fallback to enriched sample data when backend unavailable
      setContent(EDU_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  const [content, setContent] = useState<EduArticle[]>([]);

  // Filter content
  let filtered = content;
  if (selectedCategory) {
    filtered = filtered.filter((c) => c.category === selectedCategory);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q),
    );
  }

  // ─── Reading View ────────────────────────────────────────────────────────
  if (readingContent) {
    const catInfo = CATEGORY_ICONS[readingContent.category] || CATEGORY_ICONS.PLASTIC;
    const CatIcon = catInfo.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 pb-16">
        <div className="sticky top-0 z-30 eco-glass border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex h-16 items-center gap-3">
              <button
                onClick={() => setReadingContent(null)}
                className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kembali</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`size-10 rounded-xl ${catInfo.bg} flex items-center justify-center ${catInfo.color}`}>
                  <CatIcon className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{readingContent.category}</span>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{readingContent.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {new Date(readingContent.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {readingContent.videoUrl && (
                  <span className="flex items-center gap-1.5 text-eco-600">
                    <Play className="size-3.5" />
                    Tersedia Video
                  </span>
                )}
              </div>

              <div className="prose prose-sm prose-slate max-w-none">
                {readingContent.content.split('\n').map((para: string, i: number) => {
                  const trimmed = para.trim();
                  if (!trimmed) return null;
                  // Tips / checklist items
                  if (trimmed.startsWith('✓') || trimmed.startsWith('✗') || trimmed.startsWith('🌱') || trimmed.startsWith('📄') || trimmed.startsWith('🏺') || trimmed.startsWith('📱') || trimmed.startsWith('💻') || trimmed.startsWith('📺') || trimmed.startsWith('🔌') || trimmed.startsWith('🧺') || trimmed.startsWith('🎧') || trimmed.startsWith('🖨️') || trimmed.startsWith('🔋') || trimmed.startsWith('⚡')) {
                    return (
                      <p key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                        <span className="shrink-0">{trimmed.charAt(0)}</span>
                        <span>{trimmed.slice(1).trim()}</span>
                      </p>
                    );
                  }
                  // Bold headers (wrapped in **)
                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return (
                      <h4 key={i} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">
                        {trimmed.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  // Numbered steps
                  if (/^\d+\./.test(trimmed)) {
                    return (
                      <p key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed ml-4">
                        {trimmed}
                      </p>
                    );
                  }
                  // Regular paragraph
                  return (
                    <p key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3 first:mt-0">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={() => setReadingContent(null)}
            className="mt-6 btn-eco-ghost text-sm mx-auto block"
          >
            <ArrowLeft className="size-4" />
            Kembali ke daftar artikel
          </button>
        </div>
      </div>
    );
  }

  // ─── List View ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 flex flex-col items-center justify-center">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center shadow-lg animate-pulse">
          <BookOpen className="size-8 text-white" />
        </div>
        <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">Memuat Pusat Edukasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 eco-glass border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 shadow-sm">
                <GraduationCap className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white">Pusat Edukasi</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Belajar daur ulang & lingkungan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-eco-500/10 to-teal-500/10 dark:from-eco-500/10 dark:to-teal-500/10 border border-eco-100 dark:border-eco-900/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
              <Lightbulb className="size-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pusat Pengetahuan Lingkungan</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Pelajari cara memilah, mendaur ulang, dan mengurangi sampah. 
                Tingkatkan kesadaran lingkungan untuk masa depan yang lebih hijau.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel edukasi..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-eco-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-eco-300 dark:hover:border-eco-600'
            }`}
          >
            Semua
          </button>
          {CATEGORIES.map((cat) => {
            const info = CATEGORY_ICONS[cat] || CATEGORY_ICONS.PLASTIC;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isActive ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? `${info.bg} ${info.color} shadow-sm border border-current/30`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <BookOpen className="size-3" />
                {cat.replace('_', ' ')}
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        {filtered.length === 0 ? (            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center">
              <div className="mx-auto size-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                <BookOpen className="size-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Belum Ada Konten</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Tidak ditemukan artikel untuk kategori atau kata kunci yang Anda cari.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((content) => {
              const catInfo = CATEGORY_ICONS[content.category] || CATEGORY_ICONS.PLASTIC;
              const CatIcon = catInfo.icon;
              return (
                <button
                  key={content.id}
                  onClick={() => setReadingContent(content)}
                  className="group text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-eco-200 dark:hover:border-eco-700 hover:shadow-sm transition-all duration-200"
                >
                  <div className={`size-10 rounded-xl ${catInfo.bg} flex items-center justify-center ${catInfo.color} mb-3 group-hover:scale-105 transition-transform`}>
                    <CatIcon className="size-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{content.category.replace('_', ' ')}</span>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 mb-2 line-clamp-2 group-hover:text-eco-600 dark:group-hover:text-eco-400 transition-colors">
                    {content.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {content.content}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                    <Clock className="size-3" />
                    {new Date(content.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    <ChevronRight className="size-3 ml-auto text-slate-300 dark:text-slate-600 group-hover:text-eco-500 dark:group-hover:text-eco-400 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Categories overview */}
        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Kategori Pembelajaran</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const info = CATEGORY_ICONS[cat] || CATEGORY_ICONS.PLASTIC;
              const CatIcon = info.icon;
              const count = content.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-eco-200 dark:hover:border-eco-700 transition-all text-left"
                >
                  <div className={`size-9 rounded-lg ${info.bg} flex items-center justify-center ${info.color}`}>
                    <CatIcon className="size-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block leading-tight">{cat.replace('_', ' ')}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{count} Artikel</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

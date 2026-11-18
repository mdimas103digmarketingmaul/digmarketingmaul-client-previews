/* Bersama Hijra: semua isi halaman ada di sini.
   - Logo mitra: taruh file di assets/logo/, lalu isi `logo` di PARTNERS (mis. 'assets/logo/rumah-zakat.svg').
     Selama `logo` masih null, halaman menampilkan nama mitra sebagai pengganti.
   - Foto: taruh di assets/img/, lalu tambahkan ke `images` pada item terkait.
     `fit: 'contain'` untuk poster yang tidak boleh terpotong di kartu landscape. */

window.BH_PARTNERS = {
  'kemenparekraf': { name: 'Kemenparekraf', full: 'Kementerian Pariwisata dan Ekonomi Kreatif', type: 'Pemerintah', hue: '#1f5aa6', logo: null },
  'mes-jakarta':   { name: 'MES DK Jakarta', full: 'Masyarakat Ekonomi Syariah DK Jakarta', type: 'Asosiasi', hue: '#1b8a4c', logo: 'assets/logo/mes-jakarta.png' },
  'usni':          { name: 'USNI', full: 'Universitas Satya Negara Indonesia', type: 'Pendidikan', hue: '#2b3f8f', logo: 'assets/logo/usni.png' },
  'moria-fund':    { name: 'Moria Fund', full: 'Moria Fund', type: 'Fintech', hue: '#3a3fb8', logo: null },
  'artajasa':      { name: 'Artajasa', full: 'Artajasa Pembayaran Elektronis', type: 'Pembayaran', hue: '#0f6db3', logo: null },
  'indomaret':     { name: 'Indomaret', full: 'Indomaret', type: 'Ritel', hue: '#d62b2b', logo: 'assets/logo/indomaret.png' },
  'baitul-wakaf':  { name: 'Baitul Wakaf', full: 'Baitul Wakaf', type: 'Lembaga wakaf', hue: '#0d8a7a', logo: 'assets/logo/baitul-wakaf.png' },
  'rumah-zakat':   { name: 'Rumah Zakat', full: 'Rumah Zakat', type: 'Lembaga zakat', hue: '#f26b21', logo: 'assets/logo/rumah-zakat.png' },
  'dompet-dhuafa': { name: 'Dompet Dhuafa', full: 'Dompet Dhuafa', type: 'Lembaga zakat', hue: '#00843d', logo: 'assets/logo/dompet-dhuafa.png' },
  'kitabisa':      { name: 'Kitabisa', full: 'Kitabisa', type: 'Platform donasi', hue: '#1a9be6', logo: 'assets/logo/kitabisa.png' },
  'yatim-mandiri': { name: 'Yatim Mandiri', full: 'Yatim Mandiri', type: 'Lembaga zakat', hue: '#6b2a8f', logo: 'assets/logo/yatim-mandiri.png' }
};

window.BH_CATEGORIES = [
  {
    id: 'kemitraan',
    name: 'Kemitraan',
    title: 'Mitra yang memperluas jangkauan Hijra.',
    lead: 'Kerja sama dengan pemerintah, asosiasi, kampus, dan mitra bisnis untuk membuka akses layanan keuangan syariah.'
  },
  {
    id: 'filantropi',
    name: 'Produk Filantropi',
    title: 'Investasi yang pahalanya terus mengalir.',
    lead: 'Produk Hijra Bank yang memadukan deposito dengan wakaf. Pokok tetap utuh, bagi hasilnya jadi amal jariyah.'
  },
  {
    id: 'kebaikan',
    name: 'Program Kebaikan',
    title: 'Zakat, qurban, dan aksi peduli, cukup dari aplikasi.',
    lead: 'Kampanye bersama lembaga zakat dan platform donasi di momen-momen penting sepanjang tahun.',
    groups: [
      { id: 'ramadan', short: 'Ramadan', name: 'Ramadan 1447 H', note: 'Februari–Maret 2026' },
      { id: 'qurban', short: 'Qurban', name: 'Idul Adha 1447 H', note: 'Mei 2026 · Hijra Box Qurban bersama tiga lembaga' },
      { id: 'bencana', short: 'Peduli Bencana', name: 'Peduli Bencana', note: 'Agustus 2026 · NTT dan Kalimantan' }
    ]
  }
];

window.BH_ITEMS = [
  /* ---------------- Kemitraan ---------------- */
  {
    id: 'fekdi-artajasa', cat: 'kemitraan', partners: ['artajasa'],
    kind: 'Infrastruktur pembayaran', badge: 'Acara',
    title: 'Silaturahim dengan Artajasa di FEKDI x IFSE 2026',
    date: '2026-09-24', place: 'JICC, Jakarta',
    summary: 'Bertemu mitra strategis yang mendukung layanan transaksi Hijra di sela FEKDI x IFSE 2026.',
    body: 'Di sela gelaran FEKDI x IFSE 2026, Hijra Bank bersilaturahim dengan tim Artajasa Pembayaran Elektronis, salah satu mitra strategis dalam pengembangan layanan perbankan Hijra. Sinergi ini bagian dari upaya menghadirkan pengalaman transaksi yang semakin nyaman, andal, dan mudah bagi nasabah.',
    points: ['Mitra strategis untuk layanan transaksi Hijra', 'Bertemu langsung di booth FEKDI x IFSE 2026'],
    images: [
      { src: 'assets/img/fekdi-artajasa-1.jpg', w: 800, h: 533, alt: 'Perwakilan Hijra Bank dan Artajasa berfoto memegang papan logo Hijra, Artajasa, dan ATM Bersama di booth FEKDI x IFSE 2026' },
      { src: 'assets/img/fekdi-artajasa-2.jpg', w: 800, h: 533, alt: 'Penyerahan plakat antara perwakilan Artajasa dan Hijra Bank di FEKDI x IFSE 2026' }
    ],
    source: { label: 'LinkedIn Hijra Bank', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7509153815997267968' }
  },
  {
    id: 'moria-fund', cat: 'kemitraan', partners: ['moria-fund'],
    kind: 'Fintech', badge: 'MoU',
    title: 'Hijra Bank jadi mitra infrastruktur Moria Fund',
    date: '2026-09-12', place: 'Jakarta',
    summary: 'Penandatanganan MoU untuk menghadirkan rekening dan dompet digital bagi penerima manfaat Moria Fund.',
    body: 'Moria Fund resmi menggandeng Hijra sebagai mitra infrastruktur, melengkapi jaringan mitra yang sudah ada. Kerja sama ini ditujukan untuk menyediakan solusi rekening bank dan dompet digital yang andal bagi para penerima manfaat Moria Fund.',
    points: ['Hijra sebagai mitra infrastruktur perbankan', 'Rekening dan dompet digital untuk penerima manfaat'],
    images: [
      { src: 'assets/img/moria-fund.jpg', w: 893, h: 1200, fit: 'contain', alt: 'Penandatanganan MoU Moria Fund dan Hijra Bank, dengan judul Synergy Toward Sustainable Growth' }
    ],
    source: { label: 'LinkedIn pimpinan Moria Fund', url: 'https://www.linkedin.com/posts/musab-m-nosair_alhamdulilah-productive-week-prior-to-my-share-7504410218378911744-gRbz/' }
  },
  {
    id: 'mes-jakarta', cat: 'kemitraan', partners: ['mes-jakarta'],
    kind: 'Asosiasi ekonomi syariah', badge: 'PKS',
    title: 'Perjanjian kerja sama dengan MES DK Jakarta',
    date: '2025-11-24', place: 'Jakarta',
    summary: 'Joint promotion dan kolaborasi produk untuk memperkuat ekosistem ekonomi syariah dan UMKM.',
    body: 'Hijra Bank resmi menandatangani Perjanjian Kerja Sama dengan Perkumpulan Masyarakat Ekonomi Syariah (MES) DK Jakarta, dengan semangat Joint Promotion & Kolaborasi Produk.',
    points: [
      'Pemberdayaan UMKM: akses pembiayaan, permodalan, dan QRIS Soundbox syariah untuk UMKM mikro binaan MES Jakarta',
      'Literasi dan inklusi: joint promotion produk perbankan syariah ke jaringan yang lebih luas',
      'Sinergi pendanaan: kolaborasi referral untuk deposito syariah dan produk investasi lain'
    ],
    images: [
      { src: 'assets/img/mes-jakarta.jpg', w: 960, h: 1200, fit: 'contain', alt: 'Perwakilan Hijra Bank dan MES DK Jakarta berjabat tangan memegang dokumen perjanjian kerja sama' }
    ],
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DRbSi47kywY/' }
  },
  {
    id: 'usni', cat: 'kemitraan', partners: ['usni'],
    kind: 'Pendidikan',
    title: 'Beasiswa uang pangkal 100% untuk nasabah Hijra',
    date: '2025-10-10', place: 'Jakarta',
    summary: 'Nasabah Hijra bisa kuliah S1 atau S2 di USNI tanpa uang pangkal dan tanpa biaya pendaftaran.',
    body: 'Hijra Bank bekerja sama dengan Universitas Satya Negara Indonesia (USNI) untuk mendukung nasabah yang ingin melanjutkan pendidikan ke jenjang sarjana atau magister, dengan pilihan kelas reguler, hybrid, atau online.',
    points: [
      'Bebas uang pangkal dan biaya pendaftaran',
      'Biaya kuliah bisa dicicil per bulan',
      'Akses ke jaringan 10.000+ alumni',
      'Daftar dengan kode referral "Hijra Bank", batas 26 Februari 2026'
    ],
    images: [
      { src: 'assets/img/usni.jpg', w: 1200, h: 1200, fit: 'contain', alt: 'Poster Beasiswa Kuliah di USNI khusus nasabah Hijra dengan daftar fakultas dan program studi' }
    ],
    source: { label: 'Blog hijra.id', url: 'https://hijra.id/blog/articles/khusus-nasabah-bank-hijra-raih-beasiswa-kuliah-tanpa-uang-pangkal-100/' }
  },
  {
    id: 'kemenparekraf', cat: 'kemitraan', partners: ['kemenparekraf'],
    kind: 'Pemerintah', badge: 'Acara', first: 'Pertama di Indonesia',
    title: 'Pembiayaan syariah berbasis HAKI pertama di Indonesia',
    date: '2024-10-06', place: 'Yogyakarta',
    summary: 'Kreator dan pelaku ekonomi kreatif bisa memakai kekayaan intelektualnya sebagai agunan pembiayaan.',
    body: 'Hijra Bank dan Kemenparekraf sepakat menyalurkan pembiayaan syariah berbasis Hak Kekayaan Intelektual (HAKI). Direktur Utama Hijra Bank, Bembi Juniar, menyerahkan pembiayaan kepada Hendra, founder 13 Nadi Group, disaksikan Menparekraf Sandiaga Uno.',
    points: [
      'Film, konten video, hingga akun media sosial bisa menjadi agunan',
      'Tidak perlu menjaminkan mobil, tanah, atau rumah',
      'Berlandaskan PP No. 24 Tahun 2022 tentang Ekonomi Kreatif'
    ],
    images: [
      { src: 'assets/img/kemenparekraf.jpg', w: 1200, h: 801, alt: 'Penyerahan pembiayaan berbasis kekayaan intelektual di panggung acara Paving The Way for Digital Indonesia, Yogyakarta' }
    ],
    source: { label: 'Blog hijra.id', url: 'https://hijra.id/blog/uncategorized/hijra-bank-dan-kemenparekraf-sepakat-salurkan-pembiayaan-syariah-berbasis-haki-pertama-di-indonesia/' }
  },
  {
    id: 'indomaret', cat: 'kemitraan', partners: ['indomaret'],
    kind: 'Ritel',
    title: 'Tarik tunai tanpa kartu di gerai Indomaret',
    date: null, place: 'Seluruh Indonesia',
    summary: 'Nasabah Hijra bisa mengambil uang tunai di gerai Indomaret, cukup dengan aplikasi.',
    body: 'Lewat kerja sama dengan Indomaret, nasabah Hijra bisa tarik tunai tanpa kartu di gerai Indomaret di seluruh Indonesia. Buka menu Cardless Withdrawal, berikan kode penarikan ke kasir, lalu terima uang tunainya.',
    points: ['Tanpa kartu ATM', 'Tersedia di gerai Indomaret di seluruh Indonesia'],
    images: [
      { src: 'assets/img/indomaret.jpg', w: 1080, h: 1080, fit: 'contain', alt: 'Poster Tarik Tunai di Indomaret: nasabah tersenyum memegang uang tunai di depan gerai Indomaret, dengan tampilan aplikasi Hijra' }
    ],
    pending: 'Tanggal kerja sama menyusul',
    source: { label: 'hijra.id', url: 'https://hijra.id/cardless-withdrawal/' }
  },

  /* ---------------- Produk Filantropi ---------------- */
  {
    id: 'cwld-santri', cat: 'filantropi', partners: ['baitul-wakaf'],
    kind: 'Cash Waqf Linked Deposit',
    title: 'CWLD Kebun Pisang untuk Santri',
    date: '2026-01-19', place: 'Program nasional',
    period: '19 Jan – 19 Des 2026', periodNote: 'Diperpanjang dari 19 Juli 2026', ends: '2026-12-19',
    summary: 'Deposito yang bagi hasilnya otomatis menjadi wakaf produktif untuk kebun pisang santri penghafal Al-Qur\'an.',
    body: 'Bersama Baitul Wakaf, Hijra Bank menyalurkan Cash Waqf Linked Deposit untuk Program Ketahanan Pangan Kebun Pisang Cavendish. Hasil panennya membantu kebutuhan santri dan mendukung kemandirian pesantren.',
    points: [
      'Deposito mulai Rp2,5 juta, tenor 12 bulan',
      'Pokok deposito kembali utuh di akhir tenor',
      'Bagi hasil otomatis menjadi wakaf produktif'
    ],
    images: [
      { src: 'assets/img/cwld-santri-perpanjangan.jpg', w: 960, h: 1200, alt: 'Poster Cash Waqf Linked Deposit, periode pengumpulan diperpanjang 19 Januari sampai 19 Desember 2026' },
      { src: 'assets/img/cwld-santri.jpg', w: 959, h: 1200, alt: 'Poster awal Cash Waqf Linked Deposit untuk program Kebun Pisang Santri, periode 19 Januari sampai 19 Juli 2026' }
    ],
    cta: { label: 'hijrabank.id/CWLD2026Santri', url: 'https://hijrabank.id/CWLD2026Santri' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DbvCSbQzH-8/' }
  },
  {
    id: 'deposito-bil-wakaf', cat: 'filantropi', partners: [],
    kind: 'Deposito',
    title: 'Deposito Bil Wakaf',
    date: '2026-02-16', place: 'Aplikasi Hijra',
    summary: 'Solusi untuk dunia dan akhirat: berinvestasi, dapat bagi hasil bulanan, sekaligus berwakaf otomatis.',
    body: 'Dana pokok tetap utuh, sementara sebagian bagi hasilnya menjadi mesin kebaikan yang terus mengalir bagi umat. Keberkahan harta tidak hanya dilihat dari seberapa banyak yang disimpan, tetapi seberapa luas manfaatnya.',
    points: [
      'Penempatan dana di deposito syariah Hijra Bank',
      'Nisbah bagi hasil setiap bulan',
      'Sebagian bagi hasil otomatis diwakafkan'
    ],
    images: [
      { src: 'assets/img/deposito-bil-wakaf.jpg', w: 959, h: 1200, alt: 'Poster Deposito Bil Wakaf: aset terus tumbuh, pahala wakaf terus mengalir' }
    ],
    cta: { label: 'hijrabank.id/DepositoBilWakaf', url: 'https://hijrabank.id/DepositoBilWakaf' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DUzngWpk7y1/' }
  },

  /* ---------------- Program Kebaikan ---------------- */
  {
    id: 'ramadan-rumah-zakat', cat: 'kebaikan', group: 'ramadan', partners: ['rumah-zakat'],
    kind: 'Zakat & sedekah',
    title: 'Bersama menyambut Ramadan, bersama menebar kebaikan',
    date: '2026-02-28',
    summary: 'Zakat, buka puasa, kado lebaran yatim, sampai Syi\'ar Quran dalam satu tautan.',
    body: 'Menyambut bulan suci, Hijra Bank dan Rumah Zakat mengajak Sahabat Hijra menebar kebaikan tanpa batas lewat platform digital.',
    points: ['Zakat Fitrah & Zakat Maal', 'Berbagi Buka Puasa & Fidyah', 'Kado Lebaran Yatim & Bingkisan Lebaran Keluarga', 'Baju Lebaran Anak Dhuafa', 'Syi\'ar Quran & Masjid Berseri'],
    images: [{ src: 'assets/img/ramadan-rumah-zakat.jpg', w: 960, h: 1200, alt: 'Relawan Rumah Zakat menyerahkan paket Ramadan kepada seorang ibu' }],
    cta: { label: 'rumahzakat.bersamahijra.id', url: 'https://rumahzakat.bersamahijra.id' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DVSmGLnkxh2/' }
  },
  {
    id: 'ramadan-dompet-dhuafa', cat: 'kebaikan', group: 'ramadan', partners: ['dompet-dhuafa'],
    kind: 'Zakat & sedekah',
    title: '#PulihkanHarapan sesama di bulan penuh berkah',
    date: '2026-03-06',
    summary: 'Zakat fitrah Rp50.000 per jiwa, dan donasi bisa dimulai dari Rp10.000.',
    body: 'Hijra Bank dan Dompet Dhuafa mengajak Sahabat Hijra menyempurnakan ibadah Ramadan lewat berbagai pilihan kebaikan, bisa dibayar dengan QRIS.',
    points: ['Zakat Fitrah Rp50.000/jiwa', 'Berbagi Buka Puasa untuk yatim dan dhuafa', 'Sedekah Al-Qur\'an untuk santri penghafal', 'Parcel Ramadan & THR', 'Bantu Ojol & Mudik'],
    images: [{ src: 'assets/img/ramadan-dompet-dhuafa.jpg', w: 960, h: 1200, alt: 'Kakek dan cucu tersenyum menerima paket dari relawan Dompet Dhuafa' }],
    cta: { label: 'dompetdhuafa.bersamahijra.id', url: 'https://dompetdhuafa.bersamahijra.id' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DVidLoKk7rF/' }
  },
  {
    id: 'qurban-dompet-dhuafa', cat: 'kebaikan', group: 'qurban', partners: ['dompet-dhuafa'],
    kind: 'Hijra Box Qurban',
    title: 'Tebar hewan kurban bersama Dompet Dhuafa',
    date: '2026-05-18',
    summary: 'Nabung kurban di Hijra Box, pilih paket sesuai budget, dapat cashback hingga Rp700.000.',
    body: 'Wujudkan niat berkurban lebih mudah dan terencana: menabung di Hijra Box Qurban, lalu salurkan lewat Dompet Dhuafa.',
    points: ['Menabung bertahap di Hijra Box Qurban', 'Cashback s.d. Rp700.000', 'Buka tabungan sebelum 20 Mei 2026'],
    images: [{ src: 'assets/img/qurban-dompet-dhuafa.jpg', w: 960, h: 1200, alt: 'Ilustrasi sapi dan kambing di padang rumput dengan kotak Hijra Box Qurban' }],
    cta: { label: 'hijrabank.id/HijraBoxQurban', url: 'https://hijrabank.id/HijraBoxQurban' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DYe21VlE40S/' }
  },
  {
    id: 'qurban-rumah-zakat', cat: 'kebaikan', group: 'qurban', partners: ['rumah-zakat'],
    kind: 'Hijra Box Qurban',
    title: 'Siapkan qurban, sebarkan kebahagiaan',
    date: '2026-05-20',
    summary: 'Nabung qurban pelan-pelan di Hijra Box, disalurkan bersama Rumah Zakat.',
    body: 'Tidak perlu memikirkan dana sekaligus. Bersama Rumah Zakat dan Hijra Box Qurban, persiapan qurban jadi lebih mudah dan penuh makna.',
    points: ['Menabung bertahap di Hijra Box Qurban', 'Cashback s.d. Rp700.000', 'Buka tabungan sebelum 20 Mei 2026'],
    images: [{ src: 'assets/img/qurban-rumah-zakat.jpg', w: 960, h: 1200, alt: 'Ilustrasi sapi dan kambing di sofa oranye dengan latar pegunungan dan kotak Hijra Box Qurban' }],
    cta: { label: 'hijrabank.id/HijraBoxQurban', url: 'https://hijrabank.id/HijraBoxQurban' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DYi6ATbE9gG/' }
  },
  {
    id: 'qurban-kitabisa', cat: 'kebaikan', group: 'qurban', partners: ['kitabisa'],
    kind: 'Hijra Box Qurban',
    title: 'Nabung qurban praktis, kebaikan maksimal',
    date: '2026-05-20',
    summary: 'Hijra Box Qurban bersama Kitabisa, dengan cashback hingga Rp700.000.',
    body: 'Bareng Kitabisa dan Hijra Box Qurban, langkah berqurban jadi lebih gampang, aman, dan berkah.',
    points: ['Menabung bertahap di Hijra Box Qurban', 'Cashback s.d. Rp700.000', 'Buka tabungan sebelum 20 Mei 2026'],
    images: [{ src: 'assets/img/qurban-kitabisa.jpg', w: 960, h: 1200, alt: 'Ilustrasi sapi dan kambing di peternakan dengan kotak Hijra Box Qurban' }],
    cta: { label: 'hijrabank.id/HijraBoxQurban', url: 'https://hijrabank.id/HijraBoxQurban' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DYi7RRJE2PX/' }
  },
  {
    id: 'patungan-qurban', cat: 'kebaikan', group: 'qurban', partners: ['rumah-zakat'],
    kind: 'Patungan Qurban',
    title: 'Patungan sapi bareng komunitas',
    date: '2026-05-21', period: '6–27 Mei 2026',
    summary: 'Satu sapi untuk tujuh orang, lebih ringan dan lebih seru bersama komunitas.',
    body: 'Lewat Program Patungan Qurban di website Rumah Zakat, Teman Hijra bisa membuat atau bergabung ke grup patungan, membayar via QRIS atau transfer, dan memantau semuanya secara online.',
    points: ['Satu sapi ber-7, patungan bersama teman', 'Cashback hingga Rp100.000 untuk pengguna Hijra', 'Bayar via QRIS atau transfer'],
    images: [{ src: 'assets/img/patungan-qurban-rumah-zakat.jpg', w: 960, h: 1200, alt: 'Sekelompok pria berfoto bersama seekor sapi dengan latar masjid' }],
    cta: { label: 'hijrabank.id/PatunganQurban', url: 'https://hijrabank.id/PatunganQurban' },
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DYl591xk2fB/' }
  },
  {
    id: 'peduli-flores', cat: 'kebaikan', group: 'bencana', partners: ['yatim-mandiri'],
    kind: 'Aksi kemanusiaan',
    title: 'Peduli Gempa Flores NTT',
    date: '2026-08-27',
    summary: 'Makanan siap saji, air minum, paket kesehatan, dan perlengkapan tidur untuk warga terdampak.',
    body: 'Hijra Bank bersama Yatim Mandiri mengajak Teman Hijra hadir dalam aksi Peduli Gempa Flores NTT. Bantuan bisa disalurkan lewat QRIS atau rekening donasi.',
    points: ['Makanan siap saji', 'Air minum', 'Paket kesehatan', 'Perlengkapan tidur'],
    images: [{ src: 'assets/img/peduli-flores-yatim-mandiri.jpg', w: 960, h: 1200, alt: 'Poster Peduli Gempa Flores NTT bersama Yatim Mandiri dengan foto dampak gempa' }],
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DciM-cHTdIE/' }
  },
  {
    id: 'peduli-bencana-dd', cat: 'kebaikan', group: 'bencana', partners: ['dompet-dhuafa'],
    kind: 'Aksi kemanusiaan',
    title: 'Indonesia Siap Siaga untuk NTT dan Kalimantan',
    date: '2026-08-27',
    summary: 'Gerakan kemanusiaan untuk warga terdampak gempa NTT dan kebakaran di Kalimantan.',
    body: 'Hijra Bank bersama Dompet Dhuafa mengajak Teman Hijra mengambil bagian meringankan kebutuhan masyarakat terdampak dan menghadirkan kembali harapan.',
    points: ['Donasi lewat QRIS atau rekening', 'Disalurkan oleh Dompet Dhuafa'],
    images: [{ src: 'assets/img/peduli-bencana-dompet-dhuafa.jpg', w: 960, h: 1200, alt: 'Poster Indonesia Sedang Berduka dengan tim penyelamat mengevakuasi korban' }],
    source: { label: 'Instagram @ikuthijra', url: 'https://www.instagram.com/p/DciNJAATA2t/' }
  }
];

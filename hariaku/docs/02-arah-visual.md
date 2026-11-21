# 02 — Arah Visual

## A. Brand system yang diperbarui (dipakai semua opsi)

Logo tetap utuh. Yang diperbarui adalah sistem di sekitarnya: palet yang lebih lengkap dan aman dibaca, tipografi yang lebih hangat, motif, dan aturan gerak.

### Palet

Warna asli tetap menjadi inti. Tambahan diambil dari foto produk mereka sendiri (pink eyelet, latte cardigan, teal velvet).

| Token | Hex | Asal | Peran |
| --- | --- | --- | --- |
| `--ecru` | #F9F6F0 | asli | Latar utama |
| `--cream` | #F5E8CE | asli | Latar section kedua, logo di atas terakota |
| `--terracotta` | #B55B32 | asli | Bidang warna, judul besar, ilustrasi |
| `--espresso` | #362B28 | asli | Teks, latar section gelap |
| `--sage` | #8A9A86 | asli | Aksen dekoratif saja |
| `--terracotta-ink` | #9A4826 | baru | Tombol, link, teks terakota kecil (5,85:1 di ecru) |
| `--sage-ink` | #5F6E5B | baru | Label/tag sage (5,03:1 di ecru) |
| `--clay` | #E3B49A | baru | Tint lembut: hover, highlight, latar kartu |
| `--rose` | #E8C9C0 | baru, dari produk pink | Aksen musiman dan Try Me |
| `--line` | #362B28 @ 14% | baru | Garis tipis, divider, "benang" |

### Tipografi

Guideline menawarkan tiga serif (Cinzel Decorative / Playfair / Cormorant) dan tiga sans. Usulannya dipadatkan menjadi dua keluarga:

- **Cormorant Garamond** untuk display. Regular all-caps dengan tracking lebar untuk label editorial (sesuai guideline), dan **italic** untuk kalimat emosional (sesuai post IG mereka). Cinzel Decorative tidak dipakai karena terlalu ornamental untuk judul panjang dan bersaing dengan wordmark.
- **Satu sans** untuk label, harga, dan body. Pilihannya diuji per opsi: Montserrat (dari guideline), Jost, atau Hanken Grotesk. Inter tidak dipakai karena terlalu umum.

Skala: display 64–120px (clamp), judul section 40–56px, body 16–17px dengan line-height 1,6, label 11–12px all-caps tracking 0,18em.

### Motif

1. **Lengkung.** Bingkai foto, mask reveal, bentuk tombol Try Me, kartu produk.
2. **Benang.** Garis tipis 1px yang "dijahit" (stroke-dashoffset) mengikuti jalur terbang kupu-kupu.
3. **Catatan kecil.** Nomor halaman, keterangan bahan ("Katun eyelet · LD 120"), seperti hangtag. Ini juga menghubungkan web ke guideline hangtag mereka.

### Gerak

- Easing utama `cubic-bezier(0.22, 1, 0.36, 1)` (lembut, melambat di akhir). Tanpa bounce.
- Durasi: mikro 200–300ms, reveal 700–900ms, transisi halaman/Try Me 1,1–1,4s.
- Teks muncul per baris (mask dari bawah), bukan per huruf.
- Foto muncul dengan "clip" dari lengkung atau dari bawah, dengan skala 1,06 → 1.

## B. Signature: kupu-kupu yang terbang mengikuti scroll

### Cara sayap mengepak tanpa melanggar logo

1. Pakai `hariaku-3-transparent.svg` (berisi kupu-kupu saja). Sumbu simetrinya tepat di x = 1000 dari viewBox 2000.
2. Tampilkan file yang sama dua kali sebagai dua layer. Layer kiri di-clip `inset(0 50% 0 0)`, layer kanan `inset(0 0 0 50%)`.
3. Tiap layer diputar `rotateY` pada sumbu tengah dengan perspective. Sayap kiri dan kanan bergerak berlawanan, sehingga terlihat menutup lalu membuka seperti kupu-kupu sungguhan.
4. Saat sudut 0°, dua belahan menyatu persis menjadi logo master. Tidak ada path yang digambar ulang dan warna tidak diubah (versi cream hanya memakai file master cream).

Fallback untuk browser yang tidak mendukung 3D dengan baik: `scaleX` per belahan.

### Perilaku

| Keadaan | Gerak |
| --- | --- |
| Halaman dibuka | Kupu-kupu diam sebagai logo di hero. Setelah intro selesai, mengepak 2 kali lalu lepas dari posisinya. |
| Scroll pelan | Terbang mengikuti jalur (SVG path) yang melintasi halaman. Posisi di-scrub oleh scroll, tetapi diberi jeda (lerp) supaya terasa hidup, tidak menempel kaku. Mengepak pelan (±1,4 kepakan/detik). |
| Scroll cepat | Frekuensi dan amplitudo kepakan naik sesuai kecepatan scroll. Badan sedikit miring ke arah terbang. |
| Scroll berhenti | Melayang di tempat (naik-turun 4px), lalu perlahan **hinggap**: sayap menutup setengah dan mengepak sekali tiap 3–4 detik. |
| Titik hinggap | Di setiap section, jalur berhenti di elemen penting: judul section, tombol Try Me, kartu produk unggulan. Menunjuk langkah berikutnya tanpa teks tambahan. |
| Akhir halaman | Mendarat di footer, di atas wordmark HARIAKU, membentuk lockup logo lengkap. Ini penutup cerita. |
| Hover/sentuh | Terbang menjauh sedikit dari kursor lalu kembali (hanya desktop). |
| Reduced motion | Diam di navbar, tidak terbang. |
| Mobile | Ukuran lebih kecil, jalur di tepi kanan supaya tidak menutupi konten, tanpa interaksi kursor. |

Jalur terbang meninggalkan **garis benang** tipis (stroke-dashoffset ikut scroll). Garis ini menyambungkan section satu dengan yang lain seperti jahitan. Bisa dimatikan per opsi bila terasa terlalu ramai.

Teknologi: GSAP ScrollTrigger + MotionPathPlugin (gratis sejak GSAP 3.13) dan Lenis untuk smooth scroll. Kepakan sayap memakai requestAnimationFrame sendiri, terpisah dari posisi, supaya kepakan tetap berjalan saat scroll berhenti.

## C. Tiga opsi arah visual landing page

Ketiga opsi memakai brand system, data produk, dan modul kupu-kupu yang sama. Bedanya ada di layout, ritme, dan cara Try Me ditampilkan. Section mengikuti urutan brief: Hero → Edit → Try Me → Cerita → Dampak → Shop → Social.

### Option 01 — "Jurnal Hari" (editorial magazine)

**Rasa:** majalah cetak yang tenang. Paling dekat dengan brief ("clean editorial, quiet luxury").

- **Latar:** ecru dengan tekstur kertas sangat halus. Hampir tanpa bidang warna penuh; terakota hanya untuk detail.
- **Layout:** grid 12 kolom asimetris. Setiap section diberi nomor bab ("Hari 01 — Edit", "Hari 02 — Coba"). Foto besar berdampingan dengan kolom teks sempit.
- **Hero:** foto lifestyle full-bleed (wanita berhijab di dekat jendela), headline italic "Banyak peran. Tetap kamu.", satu kalimat, CTA Jelajahi Koleksi. Kupu-kupu duduk di atas headline.
- **Edit:** 3 look ditata seperti spread majalah. Hover pada foto memunculkan "hangtag" kecil berisi nama, bahan, dan harga.
- **Try Me:** section dua kolom. Kiri pilihan model, kanan hasil. Transisi hasil memakai halaman yang dibalik (page turn halus).
- **Kupu-kupu:** terbang di margin kanan seperti pembatas buku dan hinggap di setiap nomor bab. Garis benang menyambungkan nomor-nomor bab.
- **Risiko:** paling aman, tetapi bisa terasa kurang "wow" jika foto yang dipakai kurang kuat.

### Option 02 — "Ruang Terakota" (imersif, warna berganti saat scroll)

**Rasa:** berjalan dari satu ruangan ke ruangan lain di rumah HARIAKU. Paling sinematik.

- **Latar:** berganti mulus saat scroll: ecru (hero) → cream (edit) → terakota (Try Me) → espresso (cerita) → sage (dampak) → ecru (shop). Warna teks dan logo ikut menyesuaikan.
- **Layout:** section setinggi layar, banyak yang di-pin.
- **Hero:** foto dalam bingkai lengkung besar yang melebar menjadi full-bleed saat scroll pertama.
- **Edit:** lookbook horizontal yang di-pin (scroll vertikal menggerakkan rak ke samping). Klik foto membuka zoom bahan.
- **Try Me:** layar penuh berlatar terakota. Kupu-kupu terbang melintasi hasil dan sapuan sayapnya menjadi mask yang membuka gambar hasil.
- **Cerita:** latar espresso, teks besar italic krem muncul baris per baris, foto keluarga muncul bergantian.
- **Kupu-kupu:** jalur meliuk lebar melintasi tengah layar. Kepakan merespons kecepatan scroll paling kuat di opsi ini.
- **Risiko:** paling berat untuk performa dan paling mudah terasa berlebihan. Butuh disiplin menjaga teks tetap pendek.

### Option 03 — "Lemari Hariaku" (rak interaktif, Try Me sebagai pusat)

**Rasa:** masuk ke butik kecil dan langsung mencoba baju. Paling interaktif dan paling "produk".

- **Latar:** ecru dan cream dengan rak lengkung emas sebagai elemen utama, terinspirasi rak yang ada di foto produk mereka.
- **Hero:** tetap patuh brief (foto, headline, CTA). Tepat di bawahnya ada rak baju yang bisa digeser.
- **Rak:** produk asli tergantung di hanger dan sedikit berayun saat rak digeser (drag/scroll). Klik hanger untuk memakaikan baju pada model di sebelahnya. Edit dan Try Me digabung dalam satu pengalaman.
- **Try Me:** pilihan tinggi/berat memakai slider dengan siluet yang ikut berubah, swatch kulit, dan tombol gaya hijab. Hasil bisa dibandingkan dengan slider before/after.
- **Kupu-kupu:** berperan seperti pemandu toko. Hinggap di hanger yang direkomendasikan dan di tombol "Padukan", lalu terbang ke tombol Shopee setelah hasil muncul.
- **Risiko:** sangat bergantung pada kelengkapan aset Try Me. Jika aset baru sebagian, rak terlihat kosong.

### Ringkasan perbandingan

| | 01 Jurnal Hari | 02 Ruang Terakota | 03 Lemari Hariaku |
| --- | --- | --- | --- |
| Kesesuaian dengan brief | Sangat tinggi | Tinggi | Tinggi |
| Tingkat interaktif | Sedang | Tinggi (sinematik) | Tinggi (fungsional) |
| Peran Try Me | Satu section | Momen puncak | Pusat halaman |
| Beban performa | Ringan | Berat | Sedang |
| Ketergantungan aset AI | Rendah | Sedang | Tinggi |
| Cocok jika klien ingin… | elegan dan aman | kesan "wow" | konversi ke Shopee |

Rekomendasi: bangun ketiganya sebagai preview supaya bisa dibandingkan langsung. Jika harus memilih satu untuk dikembangkan, **Option 03 dengan ritme tipografi Option 01** paling seimbang antara kesan brand dan fungsi jualan.

# HARIAKU — Website Preview

Website brand fashion wanita muslim HARIAKU: landing page dengan beberapa opsi visual, kupu-kupu interaktif yang terbang mengikuti scroll, dan fitur **Try Me** (padu padan model × produk, berbasis gambar statis).

Status (21 Nov 2026): **tiga opsi landing + halaman Try Me sudah bisa dibandingkan**. Aset Try Me pilot Lite (84 gambar dari Magnific) sudah masuk ke `try-on/img/`.

| Halaman | Path |
| --- | --- |
| Hub (pilih opsi) | `/hariaku/` |
| Option 01 · Jurnal Hari | `/hariaku/option-01/` |
| Option 02 · Metamorfosis | `/hariaku/option-02/` |
| Option 03 · Lemari Hariaku | `/hariaku/option-03/` |
| **Option 04 · Final (gabungan)** | `/hariaku/option-04/` |
| Try Me (halaman penuh) | `/hariaku/try-on/` |

Jalankan lokal dari root repo: `python3 -m http.server 8743`, lalu buka `http://127.0.0.1:8743/hariaku/`.

## Keputusan yang sudah diambil

- Logo boleh dianimasikan. Kupu-kupu memakai path SVG master apa adanya, dibelah di sumbu x = 1000, dan tiap sayap diputar 3D.
- Try Me fase 1 statis, tanpa upload foto. Sumbu rambut diganti gaya hijab. Pilot Lite: 4 tubuh × 3 warna kulit × pashmina × 6 produk.
- Wakaf 2,5% hanya placeholder ("segera"). Akan dikembangkan di sesi terpisah.
- Semua aset dari klien boleh diunggah ke repo ini.

## Aset Try Me (memperbarui atau menambah)

1. Generate gambar di space Magnific **HARIAKU — Try Me (Pilot Lite)**, halaman *Try Me — Pilot Lite*. Pilot Lite (12 model dasar + 72 look) sudah lengkap.
2. Hasil diambil dari node (nama node = kombinasinya), lalu jalankan `python3 -I try-on/tools/build_looks.py fetch results.json`.
3. Skrip itu mengunduh, mengompres, memberi nama, dan menulis ulang `try-on/data/looks.js`. Tidak perlu mengubah kode.

Kombinasi yang belum punya gambar (misalnya hijab segi empat) memakai kombinasi terdekat, lalu foto asli HARIAKU dengan label "foto asli".

## Option 04 (final)

Urutan: hero Metamorfosis → Lemari + Try Me → The Edit (lookbook horizontal; klik foto membuka pratinjau, tautan teks ke Shopee) → Cerita (narasi Option 02 yang menyala baris demi baris, kolase foto bergerak mengikuti kursor) → Dampak (label wakaf dibalik) → Koleksi (rak berjalan kanan → kiri, berhenti saat kursor di atasnya, bisa digeser) → Ikuti Kami (setengah lingkaran yang membesar saat di-scroll) → footer di tengah dengan CTA "Dapatkan produknya di Shopee".

- Navbar lebih besar; "Belanja di Shopee" berupa tombol terakota dengan kilau berkala, dan tetap tampil di mobile ("Shopee").
- Setelah hero, kupu-kupu langsung hinggap di titik geser Try Me (`data-perch-focus=".9"`, `data-perch-hold=".75"`) dan terus mengepak di sana selama frame terlihat.
- Font sans: **Plus Jakarta Sans** (huruf t tidak berbentuk salib), serif tetap Cormorant Garamond. Jejak benang putus-putus dimatikan (`thread: false`).
- Di akhir hero kupu-kupu meluncur ke tengah layar, lalu turun halus ke section berikutnya. Penerbangan ini dihitung di ruang layar (`data-perch-glide`), bukan kurva dokumen, jadi tidak tersentak saat scroll.
- Di footer, badan kupu-kupu tepat di batas section Ikuti Kami dan footer (setengah di atas, setengah di bawah).
- Titik geser before/after kini berupa tombol bulat berpanah dengan label "Geser", dan sekali bergoyang kiri-kanan saat pertama terlihat (berlaku di semua opsi).

## Hero Option 02: metamorfosis

Satu foto keluarga (`lifestyle/family-hall.jpg`) dibuka lewat tiga lengkung: si kecil, kakak, lalu ayah dan ibu. Bersamaan, ulat merayap di ranting, menggantung, menjadi kepompong, lalu kepompong terbelah dan kupu-kupu (kupu-kupu terbang yang sama dengan di seluruh halaman) lahir dari dalamnya. Kupu-kupu itu di-*pin* ke kepompong selama hero (`HKButterfly.instance.pin(fn)` / `unpin()` / `hide()`), lalu dilepas saat hero selesai. Posisi lengkung diatur di `ARCH` dalam `option-02/js/main.js` (pecahan lebar/tinggi foto).

## Tautan resmi

| Kanal | URL |
| --- | --- |
| Instagram | https://www.instagram.com/bersama.hariaku |
| TikTok | https://www.tiktok.com/@bersama.hariaku |
| Shopee | https://shopee.co.id/hariakustudio |

Tautan produk Shopee per item ada di `docs/01-riset-dan-strategi.md`.

## Dokumen

| File | Isi |
| --- | --- |
| `docs/01-riset-dan-strategi.md` | Audit aset & brief klien, benchmark, strategi, konflik yang perlu diputuskan |
| `docs/02-arah-visual.md` | Usulan brand system yang diperbarui, 3 opsi arah visual landing, spesifikasi kupu-kupu |
| `docs/03-arsitektur.md` | Struktur folder, stack, data model, struktur section, tahapan build |
| `docs/04-try-on-dan-magnific.md` | UX Try Me, matriks kombinasi, konvensi nama file, rencana space Magnific & template prompt |

## Struktur folder

```text
hariaku/
├── index.html              ← hub pemilihan opsi
├── docs/                   ← riset & perencanaan
├── shared/                 ← dipakai semua opsi
│   ├── brand/              ← logo master (SVG asli, tidak digambar ulang)
│   ├── css/base.css        ← token warna, navbar, kupu-kupu, Try Me, reveal
│   ├── js/brand.js         ← path logo master untuk di-inline (+ HK.svg())
│   ├── js/data.js          ← produk, warna, tautan Shopee/IG/TikTok
│   ├── js/butterfly.js     ← kupu-kupu: kepakan 3D, jalur terbang, hinggap, benang
│   ├── js/tryon.js         ← komponen Try Me
│   ├── js/meta.js          ← hero metamorfosis (Option 02 & 04) + css/meta.css
│   ├── js/site.js          ← Lenis, navbar, reveal, helper
│   └── img/
│       ├── products/       ← foto produk asli (Shopee WebP + "Model Baju" di _studio/)
│       ├── lifestyle/      ← foto editorial (folder "Image for Web"), JPEG 2000px + -sm 960px
│       └── social/         ← thumbnail feed Instagram
├── option-01/              ← "Jurnal Hari" — editorial magazine
├── option-02/              ← "Metamorfosis" — hero keluarga ulat → kepompong → kupu-kupu, warna berganti saat scroll
├── option-03/              ← "Lemari Hariaku" — rak interaktif, Try Me sebagai hero
├── option-04/              ← Final: gabungan 02 + 03 + 01, Shopee sebagai CTA utama
└── try-on/
    ├── index.html          ← halaman Try Me penuh (juga di-embed di landing)
    ├── tools/build_looks.py← unduh hasil Magnific → img/ + looks.js
    ├── data/looks.js       ← manifest kombinasi → file gambar
    └── img/
        ├── avatars/        ← model dasar (tubuh × kulit × hijab)
        └── looks/          ← hasil padu padan (model memakai produk)
```

## Sumber aset (di luar repo)

- `~/Downloads/Brand Colour & Typography Guideline - HARIAKU Fashion.pdf`
- `~/Downloads/HARIAKU_Website_Developer_Handover_Brief.docx` (brief resmi dari klien, berisi aturan logo & Try Me)
- `~/Downloads/Asset Logo/` — logo master, termasuk `hariaku-logo-svg/`
- `~/Downloads/Project Hariaku Web Development/` — 9 produk Shopee + 10 post Instagram
- `~/Downloads/Image for Web/` — 14 foto lifestyle + `Model Baju/` (17 foto produk asli)
- `~/Downloads/HARIAKUstudio-downloader/verified-products.json` — tautan produk Shopee terverifikasi

Aset sudah disalin dan dikompres ke `shared/` (foto lifestyle dari ±35 MB menjadi 2,8 MB).

## Kupu-kupu: cara menaruh titik hinggap

Tambahkan `data-perch` ke elemen mana pun. Atribut opsional: `data-perch-x` / `-y` (0–1 di dalam elemen), `-dx` / `-dy` (px), `-dvh` (vh, untuk section yang di-pin), `-size` (px atau `fit`), `-mx` (posisi x di layar sempit), `-focus` (posisi di layar saat mendarat, 0–1) dan `-hold` (lama hinggap, dalam tinggi layar). Section gelap diberi `data-bf-tone="dark"` supaya kupu-kupu berganti ke warna cream.

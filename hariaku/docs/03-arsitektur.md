# 03 — Arsitektur

## Stack untuk preview

Mengikuti konvensi repo (Hijra Bank): HTML statis, CSS, dan JavaScript vanilla tanpa build step, di-deploy ke Cloudflare Pages.

| Kebutuhan | Pilihan | Alasan |
| --- | --- | --- |
| Scroll animation, jalur terbang | GSAP 3 + ScrollTrigger + MotionPathPlugin (CDN) | Standar industri dan sudah gratis termasuk plugin |
| Smooth scroll | Lenis (CDN) | Ringan, mudah disinkronkan dengan ScrollTrigger |
| Font | Google Fonts: Cormorant Garamond + 1 sans | Sesuai guideline |
| Gambar | WebP 3 ukuran (640/1280/1920) + `srcset`, `loading="lazy"` | Foto Gemini 2–3 MB per file perlu dikecilkan sekitar 90% |
| Data | `shared/js/data/products.js` dan `try-on/data/looks.json` | Konten bisa diubah tanpa menyentuh layout |

Untuk website production nanti, brief meminta admin panel/CMS. Itu keputusan terpisah setelah opsi visual disetujui. Preview ini sengaja dibuat data-driven supaya mudah dipindahkan ke CMS.

## Struktur file (target setelah build)

```text
hariaku/
├── index.html                    hub: daftar opsi + Try Me
├── shared/
│   ├── brand/
│   │   ├── butterfly.svg          = hariaku-3-transparent.svg (master, tidak diubah)
│   │   ├── butterfly-cream.svg    = path kupu-kupu dari hariaku-1-cream, latar dibuang
│   │   └── wordmark.svg           = path wordmark dari hariaku-2-terracotta-wordmark
│   ├── css/
│   │   ├── tokens.css             warna, font, spacing, easing
│   │   └── base.css               reset, tipografi, tombol, utilitas
│   ├── js/
│   │   ├── butterfly.js           modul kupu-kupu (kepakan, jalur, hinggap, reduced motion)
│   │   ├── scroll.js              init Lenis + ScrollTrigger, reveal teks/foto
│   │   ├── tryon.js               komponen Try Me (dipakai landing & halaman penuh)
│   │   └── data/products.js       produk, warna, foto, tautan Shopee
│   └── img/ products/ lifestyle/ social/
├── option-01/ index.html, css/style.css, js/main.js, README.md
├── option-02/ (sama)
├── option-03/ (sama)
└── try-on/
    ├── index.html
    ├── data/looks.json
    └── img/ avatars/ products/ looks/
```

Satu catatan teknis: untuk sumber logo hanya dibuang `<rect>` latar dan dipisahkan path wordmark dari path kupu-kupu. Isi path tidak diubah sama sekali.

## Data model

```js
// shared/js/data/products.js
{
  slug: "love-button-cardigan",
  name: "Love Button Cardigan",
  category: "Cardigan",
  price: null,                       // diisi setelah harga final dikonfirmasi
  material: "Knit",
  fit: "All size",
  shopee: "https://shopee.co.id/Love-Button-Cardigan-i.1266545926.51566980346",
  colors: [
    { id: "cream", label: "Cream", hex: "#EFE6D6", images: ["..."] },
    { id: "black", label: "Black", hex: "#1E1B1A", images: ["..."] }
  ],
  tryOn: true
}
```

```json
// try-on/data/looks.json
{
  "axes": {
    "body":  ["mungil", "sedang", "tinggi", "berisi"],
    "skin":  ["langsat", "sawo", "gelap"],
    "hijab": ["pashmina", "segiempat"]
  },
  "bodyRanges": {
    "mungil": { "height": [145, 155], "weight": [38, 50] }
  },
  "looks": {
    "love-button-cardigan.cream": {
      "sedang.sawo.pashmina": "img/looks/lk_love-button-cardigan-cream__sedang-sawo-pashmina.webp"
    }
  }
}
```

Jika kombinasi yang dipilih belum ada gambarnya, Try Me menampilkan kombinasi terdekat (urutan prioritas: warna kulit → gaya hijab → tubuh) dengan catatan "Kombinasi ini sedang kami siapkan". Artinya preview bisa jalan walau aset baru sebagian, dan gambar baru cukup ditambahkan ke manifest.

## Struktur section landing

| # | Section | Isi | CTA |
| --- | --- | --- | --- |
| 0 | Navbar | Logo (kupu-kupu + wordmark), Koleksi, Try Me, Cerita, Dampak, ikon IG/TikTok | Belanja di Shopee |
| 1 | Hero | 1 foto, 1 headline, 1 kalimat | Jelajahi Koleksi |
| 2 | The HARIAKU Edit | 3–6 look/produk unggulan dengan foto asli | Lihat pilihan look |
| 3 | Try Me | Pilih model → pilih produk → Padukan | Coba Try Me / Beli di Shopee |
| 4 | Cerita HARIAKU | Filosofi "Tumbuh. Menemani. Berbagi. Bermakna." | Kenali Cerita Kami |
| 5 | Berbagi Kebaikan | Wakaf 2,5%: cara hitung dan mekanismenya. Angka dan mitra hanya ditampilkan jika sudah diverifikasi klien. | Lihat Dampak |
| 6 | Shop HARIAKU | Ajakan ke toko Shopee + produk terbaru | Kunjungi Shopee |
| 7 | Social | Grid IG (thumbnail menuju post), TikTok | Ikuti @bersama.hariaku |
| 8 | Footer | Lockup logo (tempat kupu-kupu mendarat), tautan, kontak | — |

Semua tautan keluar memakai `target="_blank" rel="noopener"`.

## Anggaran performa & aksesibilitas

- LCP hero < 2,5 detik di 4G: gambar hero ≤ 180 KB, di-preload.
- Total JS ≤ 120 KB gzip (GSAP + Lenis + kode kita).
- Kupu-kupu dianimasikan hanya lewat `transform`/`opacity` (dijalankan GPU), tanpa memicu layout.
- `prefers-reduced-motion`: semua scrub dimatikan, konten tampil langsung.
- Kontras teks mengikuti tabel di `01-riset-dan-strategi.md`. Fokus keyboard terlihat. Kontrol Try Me bisa dipakai dengan keyboard dan screen reader (radio group).
- Uji di Chrome, Safari iOS, dan Chrome Android. Mobile dirancang ulang, bukan sekadar diperkecil.

## Tahapan

| Tahap | Pekerjaan | Hasil |
| --- | --- | --- |
| 0 | Riset & perencanaan | Dokumen ini ✅ |
| 1 | Fondasi | Optimasi & salin aset, `tokens.css`, `butterfly.js` (prototipe kepakan + jalur), `products.js` |
| 2 | Produksi aset Try Me (paralel) | Saya buat node & prompt di space Magnific, Anda klik generate |
| 3 | Landing Option 01, 02, 03 | Tiga preview di `/hariaku/option-0X/` |
| 4 | Try Me | Komponen + halaman penuh, diisi aset dari tahap 2 |
| 5 | Hub & daftar project | `hariaku/index.html` + entri di `assets/js/projects.js` |
| 6 | QA | Mobile, reduced motion, link checker, performa |

Tahap 1 dan 2 bisa berjalan bersamaan: saya membangun fondasi sementara Anda generate gambar.

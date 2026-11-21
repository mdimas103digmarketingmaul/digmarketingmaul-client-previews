# 04 — Try Me & Produksi Aset di Magnific

## 1. Alur Try Me

Nama fitur mengikuti brief: **Try Me**. Label tombol utama: **Padukan**.

1. **Kenalan.** Pengguna mengisi tinggi (slider 145–175 cm) dan berat (slider 38–90 kg). Sistem memetakan angka itu ke preset tubuh terdekat dan menampilkan siluetnya. Lalu memilih warna kulit (3 swatch) dan gaya hijab. Model dasar langsung berganti (crossfade) setiap kali pilihan diubah, jadi ada umpan balik sebelum memilih produk.
2. **Pilih atasan.** Deretan foto produk **asli** (latar dihapus) dengan swatch warna.
3. **Padukan.** Hasil muncul dengan transisi sapuan sayap kupu-kupu. Di bawahnya:
   - slider before/after (model dasar ↔ memakai produk)
   - keterangan "Model ini: 158 cm · 52 kg · Produk: All size (LD 120)"
   - tombol **Beli di Shopee** ke tautan produk tersebut, **Coba warna lain**, **Bagikan**
   - label "Simulasi visual. Bukan jaminan ukuran atau jatuh bahan." (wajib menurut brief)
4. Pilihan disimpan di URL (`?tb=158&bb=52&kulit=sawo&hijab=pashmina&produk=eyelet-cotton-shirt&warna=cream`), sehingga hasil bisa dibagikan dan dibuka lagi persis sama.

Karena sebagian besar produk HARIAKU **all size**, pesan Try Me bukan "ukuran mana yang pas" tetapi **"bagaimana satu ukuran ini jatuh di tubuh seperti tubuhmu"**. Pesan ini jujur dan tetap berguna.

## 2. Sumbu kombinasi

| Sumbu | Pilihan | Catatan |
| --- | --- | --- |
| Tubuh | **Mungil** (145–155 cm, 38–50 kg) · **Sedang** (155–163 cm, 48–60 kg) · **Tinggi** (163–175 cm, 50–65 kg) · **Berisi** (150–170 cm, 63–90 kg) | Input angka bebas → dipetakan ke preset terdekat |
| Warna kulit | **Kuning langsat** · **Sawo matang** · **Cokelat gelap** | Label dalam bahasa sehari-hari Indonesia |
| Gaya hijab | **Pashmina** · **Segi empat** (· Bergo/instan bila mau) | Menggantikan rambut pendek/panjang, *menunggu konfirmasi* |
| Produk × warna | Mulai dari 6 produk, 1 warna utama per produk | Warna tambahan di fase berikutnya |

### Jumlah gambar per paket

| Paket | Model dasar | Produk | Hasil look | Total generate |
| --- | --- | --- | --- | --- |
| **Lite** | 4 tubuh × 3 kulit × 1 hijab = 12 | 6 | 72 | 84 |
| **Standar (disarankan)** | 4 × 3 × 2 hijab = 24 | 6 | 144 | 168 |
| **Lengkap** | 24 | 9 produk × ±2 warna = 18 | 432 | 456 |

Hitungan di atas belum termasuk generate ulang. Untuk perencanaan, anggap ±30% gambar perlu diulang. Saran: kerjakan **Lite** dulu sebagai pilot (1–2 hari), periksa konsistensinya, lalu naikkan ke Standar.

Produk pilot yang diusulkan, dipilih karena siluet dan warnanya berbeda-beda: Love Button Cardigan (cream), Eyelet Cotton Shirt (pink), Atasan Kemeja Babydoll Evening (hitam print), Kemeja Denim Soft Jeans Bordir, Atasan Kemeja Velvet Bludru (teal), Tunik Bunga MaeBae.

## 3. Konvensi nama

| Jenis | File | Nama node di Magnific |
| --- | --- | --- |
| Model dasar | `av_{tubuh}-{kulit}-{hijab}.webp` → `av_sedang-sawo-pashmina.webp` | `AV · Sedang · Sawo · Pashmina / Nano Banana 2.1 / 1K` |
| Produk | `pr_{produk}-{warna}.webp` → `pr_eyelet-cotton-shirt-pink.webp` | `PR · Eyelet Cotton Shirt · Pink` |
| Hasil | `lk_{produk}-{warna}__{tubuh}-{kulit}-{hijab}.webp` | `LK · Eyelet Pink × Sedang·Sawo·Pashmina / Nano Banana 2.1 / 1K` |

## 4. Rencana space Magnific

Mengikuti pola space referensi Anda: satu halaman per tahap, panel gelap per grup, node teks prompt → node generator Nano Banana 2.1 / 1K, dan catatan kuning untuk instruksi. Saya hanya membuat node dan prompt; tombol generate Anda yang klik.

| Halaman | Isi |
| --- | --- |
| **00 — Aturan & Style Lock** | Catatan kuning: aturan konsistensi, konvensi nama, checklist QA. Node "STYLE LOCK" berisi paragraf latar/cahaya/kamera yang sama untuk semua prompt. |
| **01 — Model Dasar** | Satu panel per tubuh (Mungil, Sedang, Tinggi, Berisi). Isinya node prompt + generator untuk setiap kombinasi kulit × hijab. Rasio 3:4. Model **Sedang · Sawo · Pashmina** dibuat pertama sebagai *master*; setelah disetujui, gambar itu dipakai sebagai referensi gaya untuk model lain. |
| **02 — Produk** | Creation node berisi foto produk asli (dari Shopee/"Model Baju"). Latar dihapus dengan remove background, **bukan digenerate ulang**. Foto ini juga menjadi referensi untuk halaman 03. |
| **03 — Look** | Satu panel per produk. Tiap generator menerima 2 referensi: model dasar (identitas, pose, latar) + foto produk (bentuk, motif, warna). |
| **04 — Editorial (opsional)** | Foto tambahan untuk hero/section bila foto "Image for Web" kurang, misalnya rak lengkung emas untuk Option 03. |

## 5. Template prompt (draf)

Prompt ditulis dalam bahasa Inggris karena hasil Nano Banana lebih presisi. Bagian `{…}` diganti per node.

### STYLE LOCK (ditempel di akhir semua prompt)

```text
Background: smooth warm off-white limewash plaster wall, soft arched window shadow falling from the left, light oak floor, nothing else in frame. Lighting: warm natural daylight from camera-left, soft fill from the right, gentle shadows. Camera: 50mm, eye level at chest height, straight-on, subject centred, framed from 10% above the hijab to just below the knees. Colour grade: warm, matte, soft contrast, true-to-life fabric colours. Photorealistic editorial lookbook photograph. No text, no logo, no jewellery, no bag, no props.
```

### Model dasar

```text
Vertical 3:4 photograph of one Indonesian Muslim woman in her mid-20s, {BODY}, {SKIN}. She wears {HIJAB}, a plain fitted long-sleeve inner top in warm ivory, and wide-leg ecru linen trousers. Natural, light makeup, calm closed-mouth smile, looking at the camera. Standing relaxed, body turned about 10 degrees to her left, arms loose at her sides, weight on one leg.
{STYLE LOCK}
```

Isian:

- `{BODY}`
  - mungil: `petite and slim, about 150 cm tall and 45 kg, narrow shoulders`
  - sedang: `average build, about 158 cm tall and 54 kg`
  - tinggi: `tall and slender, about 168 cm tall and 58 kg, long limbs`
  - berisi: `full-figured and curvy, about 160 cm tall and 75 kg, soft rounded shoulders and fuller hips`
- `{SKIN}`
  - langsat: `light warm-yellow "kuning langsat" skin tone`
  - sawo: `medium warm-brown "sawo matang" skin tone`
  - gelap: `deep brown skin tone`
- `{HIJAB}`
  - pashmina: `a soft matte jersey pashmina hijab in warm sand, wrapped loosely around the head and draped over the shoulders and upper chest`
  - segiempat: `a square voile hijab in warm sand, folded and pinned under the chin, draping to the upper chest`

### Look (model dasar + produk)

```text
Image 1 is the model. Image 2 is the garment.
Keep everything from image 1 exactly the same: her face, skin tone, body proportions, pose, hijab style and colour, trousers, background, lighting and camera framing.
Change only her top: dress her in the garment from image 2, {PRODUCT} in {COLOUR}. Reproduce the garment faithfully: fabric texture, colour, print or embroidery and its placement, collar shape, button style and count, sleeve shape and cuff, hem shape and length.
It is an all-size {FIT} cut, so let it fall naturally on her {BODY_SHORT} frame with realistic folds and drape. The hijab sits over the garment's shoulders as it would in real life.
{STYLE LOCK}
```

`{FIT}` diisi per produk, misalnya `relaxed, slightly oversized` untuk kemeja dan `regular-fit knit` untuk cardigan.

## 6. Aturan konsistensi & QA

Setiap gambar dicek sebelum dipakai:

- [ ] Wajah sama dengan model dasarnya (identitas tidak berubah antar-look)
- [ ] Framing, posisi kaki, dan garis lantai sama (supaya crossfade mulus)
- [ ] Warna produk sesuai foto asli (cek kancing, bordir, motif)
- [ ] Jumlah dan bentuk kancing benar (Love Button: hati merah; Gold Button: emas bulat)
- [ ] Tangan dan jari wajar
- [ ] Hijab tidak menembus baju; tidak ada rambut terlihat
- [ ] Tidak ada teks, watermark, atau aksesoris tambahan

Setelah lolos QA, gambar diunduh, dinamai sesuai konvensi, lalu saya konversi ke WebP dan masukkan ke `looks.json`.

## 7. Yang sudah dibangun (21 Nov 2026)

Space: **HARIAKU — Try Me (Pilot Lite)**, halaman **Try Me — Pilot Lite (12 model × 6 produk)**. Semuanya berada di satu halaman karena koneksi node di Magnific tidak bisa lintas halaman.

| Panel | Isi |
| --- | --- |
| 01A · MASTER | `AV · Sedang · Sawo`. Generate ini pertama. |
| 01B · Model Dasar (11) | 11 model lain. Masing-masing mereferensikan master untuk latar, cahaya, framing, dan pakaian; orangnya berbeda. |
| 02.1–02.6 · LOOK | Satu panel per produk: foto produk asli (creation node) + 12 generator look. Setiap look mereferensikan model dasarnya dan foto produknya lewat mention di prompt. |

Total 84 generator (Nano Banana 2.1 · 1K · 3:4) dan 155 koneksi. Catatan kuning "CARA PAKAI" ada di kiri board.

Referensi produk yang diunggah (foto Shopee asli): Love Button Cardigan cream (04), Eyelet Cotton Shirt pink (04), Babydoll Evening (01), Denim Soft Jeans Bordir (01), Velvet Bludru teal (05), Tunik MaeBae champagne (03).

Pilot hanya memakai pashmina. Panel segi empat bisa ditambahkan dengan menduplikasi 01B dan panel look, lalu mengganti kalimat hijab di prompt.

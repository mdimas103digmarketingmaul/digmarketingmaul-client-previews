# Hijra Bank — Option 02 · "Playful & Interaktif"

The copy is short and follows hijra.id's own wording, with bold highlights on key words. The visuals use Hijra's official 3D assets, and there's a lot to play with. It's a static page (HTML + CSS + vanilla JS) with no dependencies.

- **Preview:** use a static server with HTTP Range support, which video needs (Safari won't play without it), for example `npx http-server -p 4173` from the repo root. Then open http://127.0.0.1:4173/hijra-bank/option-02/
- **Cache-busting:** bump `?v=` on the CSS/JS links after each edit.

## Copy (adapted from hijra.id)

| Section | Copy |
| --- | --- |
| Hero | "Saatnya **uangmu** bergerak dengan **tujuan / berkah / makna**." (follows the manifesto line "money move with purpose") + "Nabung berkah, sambil ibadah. Transaksi sesuai syariah untuk #LifeUpgrade dirimu." |
| Fitur | "Nyalakan semangat kebaikanmu." + 5 features from hijra.id (Hijra Box, akad wadiah, donasi, Sahabat Hijra, Acara Hijra & Tanya Ahlinya) |
| Hijra Box | "Coba bagi uangmu ke Hijra Box." |
| Produk | Tabungan, Deposito, QRIS, Isi Ulang & Tagihan, Pembiayaan Rumah, Mobile Banking |
| #LifeUpgrade | "Menjadi lebih baik dari hari kemarin." |
| CTA | "Ayo segera Hijra! Mulai hijrah finansialmu hari ini." |
| Footer | The OJK/LPS disclosure is copied verbatim from hijra.id |

## Interactions

1. **Hero (Monzo-style video):**
   - A muted 4:1 *Hijra Manifesto* loop plays under the headline, with a Jeda/Putar (pause/play) button.
   - The video pauses automatically when off screen and does not autoplay under reduced motion.
   - While scrolling, the video card grows to full-bleed width.
   - The last word of the headline cycles through its three variants.
2. **Ticker:** a moving band of keywords.
3. **Feature showcase:**
   - Advances on its own every 6 seconds, with a progress bar on the active item.
   - Pauses on hover/focus and when off screen.
   - Can be clicked or driven with the arrow keys.
4. **Hijra Box simulator:**
   - Sliders for monthly money and three boxes.
   - Main Box gets whatever is left; the total is capped at 100%.
   - The jars fill with a wave animation and show amounts in Rupiah.
   - Labelled "Simulasi untuk ilustrasi" (illustration only).
5. **Product cards:**
   - Expand on hover/focus/click, with a cursor spotlight.
   - On mobile they become a snap carousel.
6. **#LifeUpgrade statement:** lights up word by word as you scroll.
7. **Media marquee:** loops seamlessly and pauses on hover; logos turn from grey to colour.
8. **Reduced motion:** with `prefers-reduced-motion`, all of the above become static.

## Assets

| File | Source |
| --- | --- |
| `assets/product/*` (3D product icons) | hijra.id `/images/homepage/product-*` |
| `assets/feature/feature-2…5.webp` | hijra.id `/images/graphic/features/` |
| `assets/feature/feature-1-hijra-box.png` | Composite: the official phone frame from hijra.id `feature2.webp` + the real Hijra Box screenshot (`app-bank-boxes.png`) from the company profile. No AI was used. The original `feature1.webp` is only 362px, and the AI upscale changed the UI text, so it was rejected. |
| `assets/brand/hijra-3d.webp`, `ornament.svg` | hijra.id (3D brand illustration and brand ornament) |
| `assets/media/*` | hijra.id media-coverage logos; links go to the articles listed on hijra.id |
| `assets/brand/mui.png`, `ekonomi-syariah.png`, `ib-syariah.png`, `hijra-app-qr.png` | hijra.id (the LPS logo was removed at the user's request; the LPS disclosure text stays) |
| `assets/brand/hijra-logo*.png` | The two logo files supplied by the user |
| `assets/video/hijra-manifesto-loop-1920.mp4` (2.5 MB), `-1280.mp4` (0.8 MB, mobile), `hijra-manifesto-poster.jpg` | Cut from `Hijra Manifesto_FINAL 2.mp4` (user file): **94.5–121 s only** (Financial revolution → Deeply spiritual), H.264, no audio, 0.8 s fade in/out |

## To verify

- Media coverage is from 2020–2021, and two of the items link to Instagram (as on hijra.id). Check whether this should still be shown.
- The `feature-3` image (from hijra.id) mentions "Rp25.000 untuk kamu donasikan". Confirm the programme is still running.
- The hero shows the MUI and Ekonomi Syariah logos exactly as hijra.id does. Compliance should confirm this.

## Manifesto video

Only part of the source video is used (93.6 s → end). The earlier segments are left out until the client has reviewed them.

## Hero video with sound (5 Nov 2026)

- **Source:** `assets/video/hijra-manifesto-1920.mp4` (7.0 MB) and `-1280.mp4` (2.6 MB, mobile), H.264 + AAC. It is cut from `Hijra Manifesto_FINAL 2.mp4` at **93.6 s → end (61 s)**: "Financial revolution at Hijra" through "move forward without leaving values behind" and the Hijra logo. The audio starts at a natural pause, and the two sensitive segments (~40–43 s and ~87–89 s) are not included.
- **Default is sound on.** The page always tries to play with sound first.
  - Browsers (Chrome/Safari) block autoplay with sound until the visitor has interacted with the site. When that happens, the video keeps playing muted, and the sound turns on at the visitor's first tap, click or key press.
  - Visitors who have already interacted with the domain hear the sound immediately.
- **Controls:** a "Suara" (sound on/off) button and a "Jeda/Putar" (pause/play) button.
- **Behaviour:**
  - The video pauses, sound included, when it scrolls out of view, and resumes when it comes back.
  - After one full pass with sound, it keeps looping silently.
  - Under reduced motion, it does not autoplay.

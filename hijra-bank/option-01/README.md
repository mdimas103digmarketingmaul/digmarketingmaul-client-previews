# Hijra Bank — Option 01 · "Bold Cerulean" (rev. 2)

Homepage redesign exploration for Hijra Bank (PT BPRS Hijra Alami). It's a static page with no build step, the same approach as the rest of this preview repository.

- **Preview:** use a static server with HTTP Range support, which video needs (Safari won't play without it), for example `npx http-server -p 4173` from the repo root. Then open http://127.0.0.1:4173/hijra-bank/option-01/
- **Stack:** semantic HTML, a single CSS file, and vanilla JS (`js/main.js`). There are no dependencies.
- **Cache-busting:** bump `?v=` on the CSS/JS links in `index.html` after each edit.

## Revision 2 (feedback: "looks like AI slop, cerulean must come forward")

Removed:
- Magnific-generated images
- Dark-teal hero
- Glows, glassmorphism floating cards, gradient text, grain
- Monospace numbered labels
- Parallax and pointer tilt
- The photo of the woman with a phone
- Old logo files

What replaced them:
- **Colour:** Cerulean `#069EC6` as full-bleed blocks in the hero and download CTA. Variant 1 `#007999` for Deposito, Variant 2 `#11B8E4` for the arc motif, and Variant Black `#011419` for buttons and the footer. Secondary green `#87C054` is used only for small markers. The additional colours (red, green, cerulean, orange, magenta) appear only on the Hijra Box cards, following the app's own box styling.
- **Accessibility:** white text on cerulean is used only at large display sizes (it meets the AA large-text threshold). Body text on cerulean is ink.
- **Type:** Poppins for headings and DM Sans for body, matching the brand colour-guide typography.
- **Motif:** a single flat graphic, the arc above the "j" in the Hijra wordmark, scaled up.
- **Logos:** only the two supplied files, `brand/hijra-logo.png` (cerulean) and `brand/hijra-logo-white.png`.

## Sections

1. Nav: transparent on the hero, solid white after scrolling, hides on scroll down. Full-screen cerulean menu on mobile. All items are in-page anchors.
2. Hero: headline, two real app screens, and a regulatory band with product shortcuts.
3. Kenapa Hijra: the "Bebas biaya bulanan" statement plus six benefits.
4. Hijra Box: real app screen and box cards in the app's style.
5. Deposito Syariah: how a Mudharabah contract works, plus a 1/3/6/12-month flow timeline. No rates.
6. Transaksi harian: ARIA tabs for QRIS, Transfer, Tarik Tunai, Tagihan & Isi Ulang, and Fitur Islami.
7. Prinsip: Sharia, OJK/BI and LPS, plus the mission and community impact (real program photos).
8. Download CTA: official QR and store badges.
9. Footer: institutional disclosure.

## Asset provenance

| File | Source |
| --- | --- |
| `img/brand/hijra-logo.png`, `hijra-logo-white.png` | Supplied by the user (Downloads), resized to 640px |
| `img/brand/app-store-badge.png`, `google-play-badge.png` | Internal company profile |
| `img/app/*.jpg` | Real app screenshots from the company profile (demo account / masked balances only) |
| `img/photo/community-*.jpg` | Company profile community-programme photos |
| `img/brand/hijra-app-qr.png`, `ib-syariah.png`, `lps.png` | hijra.id (official). The QR decodes to `app.adjust.com/veryrh5`, the official store redirect. |

## To verify before any production use

- Whether "Bebas biaya transfer antar bank*" is still current
- Wording of the regulatory/LPS disclosure, to be approved by Compliance
- Usage rights for the community photos on a public site
- An official vector (SVG) logo

## Revision 3 (5 Nov 2026)

- Removed the LPS logo from the hero band and the footer. The iB logo stays, and the LPS disclosure text stays.
- The footer is now white, so the iB logo no longer needs a background chip. The footer uses the cerulean logo.
- "Tanya Ahlinya" and "Acara Hijra" are no longer bold.
- **Dampak:** the event photos (Gerobak Berkah, berbagi makanan) were replaced with three evergreen pillars from company profile slide 6: Sosial (wakaf community programmes), Ekonomi (inclusive finance), and Lingkungan (sustainable growth).
- **CTA:**
  - The phone splash is rebuilt in HTML with the correct Hijra Bank logo; the old app splash screenshot showed the outdated logo.
  - Title: "Mulai hijrah finansialmu hari ini."
  - Lead: "Semua kebutuhan bank syariahmu, dalam satu aplikasi."

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

## Revision 4 (5 Nov 2026)

- **Favicon:** the white h from the Hijra logo on a rounded cerulean (#069EC6) square (`favicon-32/192.png`, `apple-touch` 180). The same favicon is used in Option 02.
- **Hero:**
  - Fixed the clipped descender on the g (more room inside the line mask).
  - The kicker now reads "Bank Syariah Digital".
  - New lead with no "tanpa riba": "Menabung, bertransaksi, dan merencanakan tujuan — semua dalam satu aplikasi, sesuai prinsip syariah."
  - "Unduh Aplikasi Hijra" is now a white button, and "Lihat produk" was removed.
- **Navbar:** the active link is now a thin underline, not a white pill. It is calculated from the real scroll position, so nothing is highlighted while you are still in the hero.
- **Kenapa Hijra:**
  - "Bebas biaya bulanan & transfer.*" with "*Syarat dan ketentuan berlaku".
  - "Tabungan tanpa bunga" became "Nabung lebih tenang".
  - "Alirkan kebaikan" was replaced with Hijra Box.
  - Icons draw themselves in on reveal, items get a hover effect, and the fee card has a hover shine.
- **Hijra Box (interactive, labelled as an illustration):**
  - The phone is rebuilt in HTML following the app's Box List.
  - A tapped goal card flies into the phone as a box. Tapping a box saves money: coins pop and progress grows to 100% ("Tercapai"). Tapping × removes the box.
  - The phone tilts to follow the cursor. An auto-demo runs the first time the section is seen.
- **Deposito:** the Mudharabah steps light up one after another along a filling line.
- **Footer:**
  - Social links are icons (Instagram, YouTube, Threads). YouTube and Threads links are still pending.
  - Opening hours are laid out as a tidy list.
  - The legal text follows the official two-line format, with the iB logo on the right.
  - The copyright line is just "© 2026 Hijra Bank".
  - Removed "internal oleh DIGMARKETINGMAUL".

## Revision 5 (5 Nov 2026)

- **Mobile:**
  - The large "Unduh Aplikasi Hijra" button in the hero is hidden.
  - A small floating "Unduh" pill sits bottom-right and hides itself once the download section is in view.
  - The logo and burger now sit 24 px from the edges (safe-area aware), and the burger icon is fixed.
- **Footer:**
  - The tagline was replaced by the official legal line, with a small iB logo beside it.
  - All three social icons share one cerulean style.
  - FAQ moved under "Tentang Hijra".
  - The separate legal row was removed.
- **Dampak card:** brand teal (#007999) instead of black.
- **CTA "Mulai hijrah finansialmu hari ini.":**
  - Removed the lead line.
  - The title reveals word by word.
  - Added an iPhone/Android picker (auto-detected) that emphasises the matching store badge and adapts the QR hint.
  - The splash screen types "Assalamualaikum".
  - The phone tilts with the cursor, and the arc rotates while scrolling.

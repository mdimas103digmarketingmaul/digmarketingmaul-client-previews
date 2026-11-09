# Hijra Bank: Home Exploration

Full homepage, built on the four heroes from `../hero-exploration`. Static HTML, CSS and vanilla JS with no dependencies.

Preview from the repo root with a server that supports Range requests (video needs it in Safari), for example `npx http-server -p 4179 -c-1`, then open <http://127.0.0.1:4179/hijra-bank/home-exploration/>.

- `?hero=1` to `?hero=4` picks the hero (default 1, Genggam).
- `?clean` hides the small hero switcher.

## Page structure

| # | Section | Notes |
| --- | --- | --- |
| 1 | Hero | Four options, loaded from `heroes/` and the `<template>`s at the end of `index.html` |
| 2 | Produk | One tabbed section for all nine products, replacing the 3D product cards. Auto-advances until the visitor picks a tab |
| 3 | Kepercayaan + Liputan Media | Slim trust row (added in review) and a colour-logo rail with click-and-drag, inertia, arrows and slow drift |
| 4 | Manifesto (`#tentang`) | Video, muted autoplay in view, sound and pause buttons. Widens to full bleed on scroll |
| 5 | Unduh | Goal icons fly into the phone on scroll, the splash opens into the live app. Highlights the store for the visitor's device, hides the QR on phones |
| 6 | Footer | White, three columns |

## Navbar

Markup is in `index.html`, styles in `shared/core.css`, behaviour in `js/nav.js`. One markup serves both layouts: floating dropdowns and a two-pane Layanan panel above 900px, a full-screen accordion at 900px and below.

Order: Layanan, Ekosistem, Blog, Tentang Hijra, Bantuan, then the Mulai Hijra button. All destinations were read from the live hijra.id menu on 10 Nov 2026. Ekosistem is a non-navigable placeholder (marked "Segera") until its page exists. Bisnis has no submenu on the live site, so it is a direct link.

## Assets

- `shared/assets/product/qris-soundbox-netzme.webp` and `brand/netzme.png`: from the company profile redesign in `design-static`.
- `shared/assets/app/*`: demo and non-personal app screenshots only. Other screenshots in the company profile folder show real customer names and phone numbers, so they are deliberately not used.
- `shared/assets/video/*`: cut from `Hijra Manifesto_FINAL 2.mp4` at 96.0 s to the end (58.8 s), so the voice-over opens on "We need a financial revolution."

## To confirm before launch

- Soundbox claim "Soundbox syariah pertama di Indonesia" comes from the company profile.
- "Pembiayaan Rumah" has little verified copy. The product team should supply the details.
- The Soundbox tab has no destination page yet, so it has no "Pelajari" link.
- Media coverage is from 2020 to 2021, and two items link to Instagram (as on hijra.id).
- The OJK, BI, LPS and DPS wording reuses the earlier previews. Compliance should confirm it.
- Screens marked "Ilustrasi" are rebuilt mock-ups. Nominal values are illustrative.

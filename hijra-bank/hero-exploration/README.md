# Hijra Bank: Hero Section Exploration

Static pages (HTML, CSS, vanilla JS, no dependencies). Preview from the repo root, for example `python3 -m http.server 4179`, then open <http://127.0.0.1:4179/hijra-bank/hero-exploration/>. Add `?clean` to an option URL to hide the small option switcher.

| Option | Headline | Idea |
| --- | --- | --- |
| 01 Genggam | Setiap niat, ada box-nya. | Hand holding the phone (bunq reference). Boxes leave the screen, float, swap and fill. Aurora tints to the active box. |
| 02 Senyum | Bank yang Peduli | Smiling man showing the app over a giant headline (Revolut reference). Model photo toggle: tanpa peci / dengan peci. |
| 03 Dinding Box | Satu bank. Banyak niat baik. | No photo. The headline sits in one giant Main Box and the other boxes pour out from behind it. |
| 04 Panggung | Nabung untuk Haji. | One goal per screen. The app's colour picker drives the page; the box fills, then the page washes to the next colour. |

## How it is built

- `shared/core.js`: box data, card and phone rendering, floating cards (spring, drag, tilt, parallax), homography.
- `shared/core.css`: tokens, navbar, Hijra Box card, app UI, switcher.
- The phone photos have the screen punched out to transparency. The live HTML app sits behind the photo and is mapped to the four screen corners with `matrix3d`, so fingers and the phone frame stay in front.
- All card measures are in `em`, so one `--bs` font-size scales a whole card.
- `prefers-reduced-motion` keeps every card in place with no animation.

## Assets

| File | Source |
| --- | --- |
| `shared/assets/icons/*` (16 goal icons) | Cropped from `IMG_0815.PNG` (app "Choose icons" sheet), upscaled 4x and background-removed in Magnific |
| `shared/assets/icons/lock`, `cart`, `h-mark` | Cropped from the app screenshots |
| `shared/assets/brand/tabbar.webp` | Bottom navigation cropped from `IMG_0819.PNG` |
| `shared/assets/photo/hand`, `man`, `man-peci`, `sky` | AI generated in Magnific (Nano Banana 2.1) for this preview |

## To confirm before launch

- The people and hand are AI generated. Replace them with a real photoshoot (with a release), or get approval for AI imagery.
- Box labels are translated to Indonesian, while the app screenshots are in English. Confirm the wording against the live app.
- All nominal values are illustrative.
- The OJK and LPS line reuses the wording from the existing homepage previews. Compliance should confirm it.
- The headlines are proposals and have not been reviewed by the brand team.

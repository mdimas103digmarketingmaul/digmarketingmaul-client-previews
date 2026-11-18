# Hijra Bank: Bersama Hijra

Sub-page of `../home-exploration` (no hero; it opens on the partner wall, with the navbar solid from the top via `data-nav-solid`) that collects Hijra Bank's partnerships, philanthropic products and joint campaigns. Static HTML, CSS and vanilla JS. Navbar, tokens and buttons come from `../home-exploration/shared/core.css` and `../home-exploration/js/nav.js`.

Preview: `/hijra-bank/bersama-hijra/`. URL parameters keep the view: `?kategori=kemitraan|filantropi|kebaikan`, `?mitra=<partner slug>`, `?detail=<item id>`.

## Categories

| Category | What goes in it | Items |
| --- | --- | --- |
| Kemitraan | Agreements with government, associations, campuses and business partners | Artajasa (FEKDI x IFSE 2026), Moria Fund, MES DK Jakarta, USNI, Kemenparekraf, Indomaret |
| Produk Filantropi | Hijra products that combine a deposit with waqf | CWLD Kebun Pisang Santri (Baitul Wakaf), Deposito Bil Wakaf |
| Program Kebaikan | Campaigns with zakat bodies and donation platforms, grouped by momen | Ramadan (Rumah Zakat, Dompet Dhuafa), Qurban (Dompet Dhuafa, Rumah Zakat x2, Kitabisa), Peduli Bencana (Yatim Mandiri, Dompet Dhuafa) |

"Event" is a badge (Acara, MoU, PKS) rather than a category: only one item is purely an event, and every event is also a partnership.

## Editing content

All content is in `js/data.js`.

- **Partner logos:** put the file in `assets/logo/` and set `logo: 'assets/logo/<slug>.svg'` on the partner. Until then the page shows a coloured monogram and the name.
- **Photos:** put them in `assets/img/` and add them to the item's `images`. Use `fit: 'contain'` for posters shown in landscape cards. Several images give the card a "n foto" badge and a gallery in the detail view.
- **Running status:** set `ends: 'YYYY-MM-DD'` and the card shows "Berjalan" until that date.

## Sources (downloaded 18 Nov 2026)

- Instagram @ikuthijra: first slide of each post only. The other carousel slides need a logged-in session.
- LinkedIn: FEKDI x IFSE (Hijra Bank page, two photos) and Moria Fund (post by Moria Fund's leadership).
- hijra.id blog: USNI and Kemenparekraf.

## Logos

Eight logos come from `design-static/projects/hijra-bank/company-profile/2026-10-company-profile-redesign/assets/logos/partners/` (`mes-dki-jakarta.png` is renamed `mes-jakarta.png`). The Indomaret poster was supplied by the team.

## Still missing

- Logos for Kemenparekraf, Moria Fund and Artajasa (not in the company profile folder).
- Indomaret: partnership date and a public post. The link provided is the LinkedIn admin page, which is not public.
- Deposito Bil Wakaf: which waqf institution manages it.
- Extra carousel slides, for example more photos from the MES DK Jakarta signing.

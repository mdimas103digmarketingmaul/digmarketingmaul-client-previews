# DIGMARKETINGMAUL — Client Previews

Repository publik untuk menyimpan website preview calon client / client aktif sebelum project masuk ke repository production masing-masing.

## Struktur

```text
/
├── index.html
├── 404.html
├── .gitignore
├── assets/
│   ├── brand/
│   ├── css/
│   └── js/
├── _client-template/
│   ├── index.html
│   ├── option-01/
│   ├── option-02/
│   └── assets/
└── README.md
```

## Menambahkan client baru

1. Duplicate folder `_client-template`.
2. Rename folder menggunakan slug client, contoh:
   - `hanasari-catering`
   - `mammaroti`
   - `beliayam`
3. Edit `index.html` di folder client:
   - Ganti `CLIENT NAME`
   - Ubah judul/deskripsi option bila diperlukan.
4. Replace isi `option-01/`, `option-02/`, dst. dengan website preview masing-masing.
5. Tambahkan project ke `assets/js/projects.js`.

Contoh:

```js
window.DM_PROJECTS = [
  {
    name: "Hanasari Catering",
    slug: "hanasari-catering",
    type: "Website Design & Development",
    status: "Design Review",
    updated: "15 Oct 2026",
    options: 2,
    accent: "#d9ff57"
  }
];
```

## URL

Jika Cloudflare Pages project menggunakan domain:

`digmarketingmaul-preview.pages.dev`

maka:

- Dashboard: `https://digmarketingmaul-preview.pages.dev/`
- Client: `https://digmarketingmaul-preview.pages.dev/hanasari-catering/`
- Option 01: `https://digmarketingmaul-preview.pages.dev/hanasari-catering/option-01/`

Jika nanti memakai custom domain:

`preview.digmarketingmaul.com`

maka path client tetap sama.

## Catatan workflow

Repository ini adalah **preview workspace**, bukan production website client.

Flow yang disarankan:

`Brief → Design Exploration → Preview Workspace → Client Approval → Production Repository → Custom Domain`

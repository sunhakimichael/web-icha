# Tech stack — NusaByIcha

Ringkasan teknologi, konfigurasi, dan cara menguji. Gambaran umum ada di [overview.md](overview.md), alur
logika di [logic-flow.md](logic-flow.md).

## Bahasa & arsitektur

- **HTML + CSS + JavaScript murni.** Tidak memakai framework, `package.json`, bundler, maupun langkah build.
- **ES modules native.** Halaman memuat `<script type="module" src="/js/main.js">`, lalu modul lain
  di-`import` dengan path relatif (`./config.js`, dll.).
- `public/` disajikan apa adanya, baik di lokal maupun di Vercel.
- **Script inline di `<head>`.** Hanya ada satu, yaitu script tema yang memasang kelas `html.dark` sebelum
  halaman tampil agar tidak berkedip. Script yang sama dipakai di `index.html` dan `privacy.html`, dan
  hash SHA-256-nya tercantum di CSP. Selain itu ada blok `<script type="application/ld+json">` (data
  JSON-LD, bukan kode yang dijalankan).

## Layanan & dependensi luar

| Layanan                                | Untuk apa                                                             | Konfigurasi                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Web3Forms (`api.web3forms.com/submit`) | Meneruskan isi form ke email Icha                                     | `web3formsKey` di `public/js/config.js`. Key ini memang publik. Kalau dikosongkan, situs beralih ke mode WhatsApp saja |
| WhatsApp (`wa.me`)                     | Tombol kontak dan cadangan saat kirim form gagal                      | `whatsappNumber` di `config.js`                                                                                        |
| Google Fonts                           | Cormorant Garamond (600, 700, italic 500) dan DM Sans (400, 600, 700) | `<link>` di `<head>` setiap HTML                                                                                       |
| Vercel                                 | Hosting statis, auto-deploy dari `main`                               | `vercel.json`                                                                                                          |
| GitHub Actions                         | CI di setiap push dan PR                                              | `.github/workflows/check.yml`                                                                                          |

Tidak ada dependensi npm saat runtime. Prettier 3.3.3 dipanggil lewat `npx` hanya untuk pengecekan format.

## Konfigurasi

- **`public/js/config.js`** adalah satu-satunya tempat data kontak: nomor WA, key Web3Forms, URL Instagram,
  email, dan `storagePrefix` (`nusabyicha-`). Ikon footer yang nilainya kosong otomatis disembunyikan.
- **`vercel.json`** berisi:
  - `outputDirectory: "public"` dan `buildCommand` kosong.
  - Header keamanan untuk semua path:
    - CSP: `script-src 'self'` + hash script tema, `style-src` + `fonts.googleapis.com`, `font-src`
      `fonts.gstatic.com`, `connect-src 'self' https://api.web3forms.com`, `frame-ancestors 'none'`,
      `object-src 'none'`.
    - `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`.
  - Cache: HTML/XML/TXT dan `css/`, `js/` memakai `max-age=0, must-revalidate`. Gambar, favicon, dan
    apple-touch-icon di-cache 30 hari.
- **Domain** `https://web-icha.vercel.app` ditulis di beberapa tempat: `index.html` (canonical, OG,
  JSON-LD), canonical di `privacy.html`, `robots.txt`, `sitemap.xml`, README, dan `docs/`. Kalau domain
  berubah, semuanya harus diganti (`grep -rn web-icha.vercel.app`).
- **`.prettierrc`**: `singleQuote: true`, `printWidth: 110`.
- **`.gitignore`**: selain file sistem dan editor, juga mengabaikan `.claude/`, dokumen rencana
  `/Rencana-Pengerjaan-*.docx`, dan template prompt `/Prompt - *.md` (keduanya hanya disimpan lokal).

## Entry point

- `public/index.html` → `js/main.js` menjalankan `initBooking()`, `initUi()`, lalu
  `setLanguage(getLanguage())`.
- `public/privacy.html` hanya memuat CSS dan script tema inline. Halaman ini tidak memuat modul JS
  (teks ID/EN keduanya ditulis langsung di halaman).

## Menjalankan & menguji

Kebutuhan: Node 20+ (untuk cek) dan python3 (untuk server preview lokal).

```bash
./scripts/check.sh                         # cek statis
./scripts/check.sh --serve [--port 3000]   # cek, lalu python3 http.server di 127.0.0.1
npx prettier@3.3.3 --check public          # cek format (juga dijalankan di CI)
npx prettier@3.3.3 --write public          # rapikan format
```

`scripts/check.mjs` memeriksa:

1. Sintaks setiap file `.js` di `public/` (`node --input-type=module --check`).
2. Tidak ada sisa referensi `manus-storage`.
3. Setiap `src`/`href`/`srcset` lokal di HTML, `url()` di CSS, dan `import` relatif di JS mengarah ke file
   yang benar-benar ada.
4. Kunci terjemahan `id` dan `en` sama persis, dan setiap `data-i18n`/`data-i18n-label` di `index.html`
   punya kunci yang cocok.
5. Hash setiap `<script>` inline cocok dengan CSP di `vercel.json`.
6. `vercel.json` dan file `.json` di `public/` valid.
7. Nomor `wa.me/…` di HTML sama dengan `whatsappNumber` di `config.js`.

**Belum ada test unit.** Perilaku seperti form, modal, bahasa, dan tema diuji manual di browser: mode
terang/gelap, lebar 375 px, navigasi keyboard, dan kirim form sungguhan. Panduan lengkapnya ada di
[../docs/LOCAL-TESTING-AND-HOSTING.md](../docs/LOCAL-TESTING-AND-HOSTING.md).

## Catatan perawatan

- **Script tema inline berubah?** Hitung ulang hash-nya dan perbarui CSP di `vercel.json`. Pesan galat
  `check.sh` mencantumkan hash yang benar.
- **Menambah domain eksternal** (misalnya font, gambar, atau API lain)? Tambahkan ke direktif CSP yang
  sesuai, karena tanpa itu browser akan memblokirnya di production.
- **Teks baru di halaman?** Tambahkan kuncinya di `translations.js` untuk **kedua** bahasa. Kunci yang
  berakhiran `Html` dipasang dengan `innerHTML`, sisanya dengan `textContent`.

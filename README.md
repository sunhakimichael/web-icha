# NusaByIcha

Website personal bilingual (ID/EN) untuk **Icha**: local guide Jawa–Bali, travel planner, dan pengajar bahasa online.

**Situs:** <https://web-icha.vercel.app>

## Fitur

- Landing page editorial dengan mode terang/gelap (mengikuti sistem, bisa diubah manual) dan bahasa ID/EN (mengikuti bahasa browser, bisa diubah manual).
- Form dinamis untuk empat layanan: **Booking Guide**, **Travel Plan**, **Kelas Online**, dan **Kontak Umum**.
  - Jawaban dikirim ke email Icha lewat [Web3Forms](https://web3forms.com). Setelah terkirim, pengunjung bisa melanjutkan percakapan di WhatsApp dengan ringkasan yang sudah terisi.
  - Jika access key Web3Forms belum diisi, form otomatis beralih ke mode WhatsApp-only.
  - Ada honeypot anti-spam, state loading, dan pesan error yang jujur. Isian tidak hilang saat gagal kirim atau saat bahasa diganti.
- Catatan Perjalanan dengan filter lokasi, plus filter tahun yang dibuat otomatis dari data kartu.
- Aksesibilitas: skip link, focus trap di modal, fokus kembali ke tombol pemicu, `aria-expanded`/`aria-pressed`, `:focus-visible`, dan `prefers-reduced-motion`.
- SEO dan sharing: Open Graph/Twitter Card, favicon, canonical, JSON-LD, `robots.txt`, `sitemap.xml`.
- Halaman [Kebijakan Privasi](public/privacy.html).

## Struktur

Semua yang dipublikasikan ada di `public/`. Tidak ada build step dan tidak ada dependensi npm.

```text
public/
├── index.html            # Halaman utama
├── privacy.html          # Kebijakan privasi (ID + EN)
├── css/styles.css
├── js/
│   ├── config.js         # ← Nomor WhatsApp, key Web3Forms, link sosial
│   ├── translations.js   # Semua teks ID/EN
│   ├── forms.js          # Definisi pertanyaan tiap form
│   ├── booking.js        # Render form, validasi, pengiriman
│   ├── ui.js             # Tema, menu, modal, filter
│   ├── i18n.js, storage.js, util.js, main.js
├── img/                  # Foto (WebP, 2 ukuran) + og-image.jpg
└── favicon.svg, apple-touch-icon.png, robots.txt, sitemap.xml
scripts/check.sh          # Pemeriksaan statis (juga dijalankan di CI)
vercel.json               # Output directory, header keamanan, dan cache
```

## Konfigurasi

Semua pengaturan kontak ada di `public/js/config.js`:

| Kunci            | Isi                                                                      |
| ---------------- | ------------------------------------------------------------------------ |
| `whatsappNumber` | Nomor WA tanpa `+`, dengan kode negara.                                  |
| `web3formsKey`   | Access key dari web3forms.com (memang aman untuk publik). Kosong = mode WA. |
| `instagramUrl`   | URL profil Instagram. Kosong = ikon disembunyikan.                       |
| `email`          | Alamat email publik. Kosong = ikon disembunyikan.                        |

Jika nomor WhatsApp diganti, ganti juga link `wa.me` di `privacy.html`. `check.sh` akan gagal kalau keduanya berbeda.

**Domain:** URL `https://web-icha.vercel.app` dipakai di `index.html` (canonical, Open Graph, JSON-LD), `privacy.html`, `robots.txt`, dan `sitemap.xml`. Ganti semuanya setelah domain final ditentukan:

```bash
grep -rl "web-icha.vercel.app" public | xargs sed -i '' 's#https://web-icha.vercel.app#https://DOMAIN-BARU#g'
```

## Menjalankan lokal

```bash
./scripts/check.sh --serve
```

Perintah ini menjalankan pemeriksaan, lalu membuka preview di `http://127.0.0.1:3000`. Yang diperiksa: sintaks JS, file aset yang dirujuk benar-benar ada, tidak ada sisa `manus-storage`, kunci terjemahan ID/EN lengkap, hash CSP cocok dengan script inline, dan nomor WA konsisten.

Jika script inline di `<head>` diubah, perbarui hash `sha256-…` di `vercel.json`. Pesan error `check.sh` akan menunjukkan hash yang benar.

Format kode dengan Prettier (CI juga mengecek ini):

```bash
npx prettier@3.3.3 --write public
```

## Menambah cerita di Catatan Perjalanan

1. Siapkan foto dalam dua lebar (800 px dan 480 px, WebP), misalnya `public/img/story-bali-coast-800.webp` dan `-480.webp`.
2. Tambahkan `<article class="story-card">` di `.journal-grid` pada `index.html`. Salin salah satu kartu yang ada, lalu isi `data-location` (`java`/`bali`) dan `data-year`. Tombol filter tahun akan muncul otomatis.
3. Tambahkan `storyFourTitleHtml` dan `storyFourCopy` di **kedua** bahasa pada `public/js/translations.js`. Akhiran `Html` berarti teks boleh berisi markup seperti `<br />`; kunci lain selalu ditampilkan sebagai teks biasa.
4. Jalankan `./scripts/check.sh`.

## Deploy

Hosting di Vercel: <https://web-icha.vercel.app>. Setiap push ke `main` otomatis di-deploy ke production. Lihat [docs/LOCAL-TESTING-AND-HOSTING.md](docs/LOCAL-TESTING-AND-HOSTING.md).

## Lisensi

Kode dirilis dengan lisensi MIT (lihat [LICENSE](LICENSE)). Foto, teks, dan identitas merek NusaByIcha adalah milik Icha dan **tidak** termasuk dalam lisensi tersebut.

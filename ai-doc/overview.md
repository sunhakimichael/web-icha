# Overview — NusaByIcha

Situs personal satu halaman milik Icha: pemandu lokal Jawa–Bali, perencana perjalanan, dan guru bahasa
(BIPA dan English). Situs statis dwibahasa (ID/EN) yang di-host di Vercel:
<https://web-icha.vercel.app>.

Dokumen terkait: [tech-stack.md](tech-stack.md) · [logic-flow.md](logic-flow.md) · [schema.md](schema.md) ·
[../docs/LOCAL-TESTING-AND-HOSTING.md](../docs/LOCAL-TESTING-AND-HOSTING.md) (panduan uji lokal & deploy).

> **Kode adalah acuan.** Kalau isi dokumen ini berbeda dengan kode, kodenyalah yang benar dan dokumen ini
> harus diperbaiki.

## Fitur

- **Halaman utama** (`public/index.html`), urutan bagian:
  1. Hero (`#top`): foto, judul, tombol ke `#traveling` dan `#learn`.
  2. Layanan (`#services`): tiga kartu, yaitu Booking Guide, Travel Plan, dan Learn With Me (`#learn`).
  3. Tentang saya (`#about`): foto, cerita singkat, angka "3 bahasa / 8+ tahun / ∞".
  4. Catatan Perjalanan (`#journal`): kartu cerita dengan filter Semua/Jawa/Bali. Tombol filter tahun
     dibuat otomatis dari `data-year` di setiap kartu.
  5. Kelas bahasa (`#classes`): BIPA dan English, Rp 180k per sesi.
  6. Proses: langkah-langkah memesan.
  7. Testimoni.
  8. Kontak (`#contact`): tombol WhatsApp dan tombol buka formulir.
  9. Footer: link sosial (IG/WA/Email), link kebijakan privasi, tahun otomatis.
- **Modal formulir layanan** dengan 4 jenis form: `guide`, `plan`, `learn`, `contact`. Dibuka dari tombol
  ber-atribut `data-booking`. Pertanyaannya berbeda per layanan (lihat [schema.md](schema.md)).
- **Pengiriman form** ke Web3Forms (diteruskan ke email Icha). Kalau gagal, ada tombol lanjut lewat
  WhatsApp. Alurnya ada di [logic-flow.md](logic-flow.md).
- **Dwibahasa ID/EN**: default dari bahasa browser, pilihan disimpan di `localStorage`.
- **Mode terang/gelap**: default dari setelan sistem, pilihan disimpan di `localStorage`.
- **Aksesibilitas**: skip link, fokus terkunci di modal (focus trap + `inert`), `:focus-visible`,
  `prefers-reduced-motion`, `aria-pressed`/`aria-expanded`, teks minimal 11 px.
- **SEO & berbagi**: Open Graph/Twitter Card (`img/og-image.jpg`), JSON-LD `TravelAgency`, `robots.txt`,
  `sitemap.xml`, favicon.
- **Kebijakan privasi** (`public/privacy.html`, ID/EN): data yang dikirim lewat form (via Web3Forms),
  pemuatan Google Fonts, dan penyimpanan paling lama 12 bulan setelah komunikasi terakhir.

## Cara menjalankan

Tidak ada langkah build atau instalasi dependensi. Yang dibutuhkan hanya Node 20+ dan python3.

```bash
./scripts/check.sh            # cek statis
./scripts/check.sh --serve    # cek, lalu preview di http://127.0.0.1:3000
```

Deploy: setiap push ke `main` otomatis di-deploy Vercel ke production. Detailnya ada di
[tech-stack.md](tech-stack.md).

## Peta file

```
public/                 ← satu-satunya sumber; disajikan apa adanya
  index.html            halaman utama (+ script tema inline di <head>, hash-nya ada di CSP)
  privacy.html          kebijakan privasi ID/EN
  css/styles.css        semua gaya (token warna di :root, mode gelap di html.dark)
  js/main.js            entry point: initBooking → initUi → setLanguage
  js/config.js          nomor WA, key Web3Forms, Instagram, email, prefix localStorage
  js/translations.js    kamus teks id/en
  js/i18n.js            bahasa aktif, t(), setLanguage(), onLanguageChange()
  js/forms.js           definisi field form per layanan (data murni)
  js/booking.js         render form, validasi, kirim ke Web3Forms, fallback WhatsApp
  js/ui.js              tema, menu, modal, filter jurnal, link kontak, toast
  js/storage.js         readPref/writePref (prefix nusabyicha-, migrasi dari jelajahku-)
  js/util.js            escapeHtml, focusableIn
  img/                  gambar WebP (2 ukuran + srcset), og-image.jpg
  favicon.svg, apple-touch-icon.png, robots.txt, sitemap.xml
scripts/check.sh        pembungkus check.mjs (+ opsi --serve)
scripts/check.mjs       cek statis (lihat tech-stack.md)
vercel.json             outputDirectory public, CSP & header keamanan, cache header
.github/workflows/check.yml   CI: check.sh + Prettier
docs/LOCAL-TESTING-AND-HOSTING.md   panduan uji lokal, Web3Forms, deploy
README.md, LICENSE (MIT untuk kode; foto/teks/merek milik Icha), .prettierrc
```

## Placeholder yang sengaja dipertahankan

Selama pengembangan, bagian berikut memang dibiarkan. Jangan dihapus atau diganti labelnya tanpa
persetujuan pemilik.

- Testimoni contoh (Marina K.); ditandai komentar di `index.html`.
- Link "Baca cerita" di kartu jurnal mengarah ke `#contact`.
- Tombol "Lihat semua cerita" hanya menampilkan toast "Jurnal lengkap segera hadir…".
- Checkbox persetujuan kebijakan DP & pembatalan; halaman kebijakannya belum ada.
- Foto hero sementara (sawah) dan kartu cerita Borobudur berupa gradien (`.story-image-placeholder`).

## Keterbatasan & yang ditunda

- Belum ada framework test unit. Pengecekan otomatis hanya `check.mjs` + Prettier, uji tampilan dilakukan
  manual di browser.
- Font masih dimuat dari Google Fonts (render-blocking ±1,3 dtk di mobile). Self-host font (U7) belum
  diputuskan.
- Menunggu materi: foto hero final, foto Borobudur, teks kebijakan DP & pembatalan, domain final (saat ini
  `web-icha.vercel.app`).
- Halaman jurnal lengkap dan isi "Baca cerita" belum dibuat.
- Kalau `web3formsKey` di `config.js` dikosongkan, form otomatis beralih ke mode WhatsApp saja.

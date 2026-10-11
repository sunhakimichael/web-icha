# NusaByIcha

Website personal bilingual untuk **Icha** — local guide Jawa–Bali, travel planner, dan pengajar bahasa online.

## Tentang project

NusaByIcha membantu calon traveler untuk:

- Menemukan pengalaman perjalanan lokal di Jawa dan Bali.
- Mengirim brief **Booking Guide**.
- Mengisi kuesioner **Travel Plan**.
- Memilih alur **Booking Kelas Online**.
- Mengirim pesan melalui **Kontak Umum**.
- Beralih antara bahasa Indonesia dan Inggris.
- Menggunakan mode terang atau gelap.

Website ini adalah prototipe/pilot interaktif. Form belum mengirim data ke layanan eksternal dan belum memiliki pembayaran nyata.

## Fitur utama

- Landing page editorial dengan hero lanskap Indonesia.
- Foto profil Icha dari aset asli yang disediakan.
- Catatan perjalanan dengan filter lokasi/tahun.
- Form dinamis berbasis layanan dengan field ID/EN, pilihan tunggal/ganda, validasi field wajib, persetujuan kebijakan, dan pesan privasi.
- Tombol WhatsApp menggunakan nomor `+6282331458963`.
- Responsive layout untuk desktop dan mobile.
- Output publish statis dari folder `public/`.

## Struktur file

```text
.
├── index.html              # Markup halaman utama
├── styles.css              # Sistem visual dan responsive layout
├── app.js                  # Toggle bahasa, tema, modal, filter, dan form dinamis
├── app.config.ts           # Metadata project WebDev
├── manus-routes.json       # Manifest route website
├── public/                 # Output statis yang dipakai preview/publish
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── icha-photo.webp
│   └── manus-routes.json
└── README.md
```

## Menjalankan secara lokal

Server preview menggunakan Python HTTP server pada port `3000` dan menyajikan folder `public/`:

```bash
python3 -m http.server 3000 --bind 0.0.0.0 --directory public
```

Lalu buka `http://localhost:3000`.

## Validasi

```bash
node --check app.js
node --check public/app.js
python3 -m json.tool public/manus-routes.json
```

## Publish

Build statis menggunakan kontrak berikut:

```json
{
  "command": "true",
  "outputDirectory": "public"
}
```

Versi publik saat ini dikelola melalui Manus WebDev. Repository ini berisi source code dan asset project untuk backup serta pengembangan lanjutan.

## Lisensi dan aset

Foto profil Icha digunakan berdasarkan aset yang disediakan oleh pemilik website. Aset visual lanskap lainnya digunakan untuk kebutuhan desain website NusaByIcha.

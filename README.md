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
- Tombol WhatsApp menggunakan nomor `+6282146138885`.
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

## Menjalankan dan men-deploy secara lokal

### Menjalankan preview lokal

Pastikan Python 3 tersedia, lalu jalankan dari root project:

```bash
cd web-icha
python3 -m http.server 3000 --bind 127.0.0.1 --directory public
```

Buka `http://127.0.0.1:3000`. Untuk menghentikan server, tekan `Ctrl+C`.

### Menyiapkan output publish

Source utama berada di root, sedangkan folder `public/` adalah output yang disajikan dan dipublish. Setelah mengubah source, sinkronkan file statis:

```bash
cp index.html styles.css app.js manus-routes.json public/
node --check app.js
node --check public/app.js
python3 -m json.tool public/manus-routes.json >/dev/null
```

### Deploy statis lokal atau hosting pilihan

Gunakan `public/` sebagai **publish directory**. Untuk platform yang meminta konfigurasi build, gunakan:

```json
{
  "build": {
    "command": "true",
    "outputDirectory": "public"
  }
}
```

Tidak ada backend atau database yang diperlukan untuk prototipe ini. Jika memakai hosting statis lokal, cukup jalankan HTTP server dari `public/`. Jangan deploy root project sebagai directory utama karena browser akan membutuhkan file dari `public/`.

## Cara menambah foto dan cerita di Catatan Perjalanan

1. Simpan foto yang sudah disetujui di `public/`, misalnya `public/story-bali-coast.webp`.
2. Buka `index.html`, lalu tambahkan satu blok `.story-card` di dalam `.journal-grid`.
3. Gunakan `data-location` seperti `java` atau `bali` dan `data-year` empat digit agar tombol filter tetap berfungsi.
4. Gunakan `alt` text yang menjelaskan lokasi dan suasana foto.
5. Tambahkan key judul dan ringkasan di **dua** bahasa pada objek `id` dan `en` di `app.js`, misalnya `storyFourTitle` dan `storyFourCopy`.
6. Sinkronkan source ke `public/`, jalankan validasi, lalu commit.

Contoh kartu baru:

```html
<article class="story-card" data-location="bali" data-year="2026">
  <div class="story-image">
    <img src="/story-bali-coast.webp" alt="Pantai pasir hitam Bali saat matahari terbenam" />
    <span class="story-tag">Bali</span>
  </div>
  <div class="story-meta"><span>Jun 2026</span><span>5 min read</span></div>
  <h3 data-i18n="storyFourTitle">Judul cerita<br />di sini</h3>
  <p data-i18n="storyFourCopy">Ringkasan singkat cerita perjalanan.</p>
  <a class="story-link" href="#contact"><span data-i18n="readStory">Baca cerita</span> ↗</a>
</article>
```

Kemudian tambahkan terjemahannya di `app.js`:

```js
// di dalam id
storyFourTitle: 'Judul cerita<br />di sini',
storyFourCopy: 'Ringkasan singkat dalam Bahasa Indonesia.',

// di dalam en
storyFourTitle: 'A story title<br />goes here',
storyFourCopy: 'A short English summary of the journey.',
```

Pertahankan tinggi `.story-image` yang sama dengan kartu lain agar layout Catatan Perjalanan tetap seimbang.

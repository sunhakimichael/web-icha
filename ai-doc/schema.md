# Schema data — NusaByIcha

Situs ini tidak punya database atau backend sendiri. Data yang ada hanya tiga jenis:

- isian formulir yang dikirim ke Web3Forms (lalu diteruskan ke email Icha) atau ke WhatsApp;
- dua preferensi tampilan di `localStorage`;
- teks ID/EN di `translations.js`.

Alurnya dijelaskan di [logic-flow.md](logic-flow.md).

## 1. Definisi formulir (`public/js/forms.js`)

`formSchemas` berisi empat layanan: `guide`, `plan`, `learn`, dan `contact`. Setiap layanan punya
`title`, `intro`, `confirmation` (teks setelah berhasil terkirim), dan `fields`.

**Bentuk satu field:**

| Properti      | Arti                                                                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `section`     | Bukan input, hanya judul bagian (A, B, C…)                                                                                                                  |
| `name`        | Nama input; juga kunci di `FormData`                                                                                                                        |
| `type`        | `text`, `email`, `tel`, `number`, `date`, `select`, `textarea`, `checkbox` (satu centang, nilai `✓`), `checkboxes` (grup)                                   |
| `label`       | Teks ID/EN                                                                                                                                                  |
| `required`    | Wajib diisi. Pada `checkboxes`, artinya minimal satu yang dicentang                                                                                         |
| `options`     | Untuk `select`/`checkboxes`. Bentuknya `[nilai, labelId, labelEn]` atau `[labelId, labelEn]`. Pada bentuk kedua, label Indonesia sekaligus menjadi nilainya |
| `sensitive`   | Data sensitif yang boleh dilewati; diberi keterangan "boleh dilewati"                                                                                       |
| `conditional` | `'multi'`: field hanya tampil kalau `package = multi`                                                                                                       |

**Field per layanan** (`*` = wajib, `S` = sensitif):

- **`guide`** — Booking Guide Lokal Jawa-Bali
  - Tentang Anda: `fullName*`, `email*`, `whatsapp*`, `country`
  - Detail tur:
    - `package*` (`half`/`full`/`multi`/`unsure`)
    - `startDate*`; `endDate` (hanya untuk `multi`)
    - `destinations` (grup)
    - `adults*`, `children`
    - `guideLanguage*`, `pickup`
  - Kebutuhan khusus: `transport*`, `dietary` S, `accessibility` S, `expectations`, `notes`
  - Penutup: `heardFrom`, `policy*` (setuju kebijakan DP & pembatalan)
- **`plan`** — Rancang Perjalanan
  - Kontak: `fullName*`, `email*`, `whatsapp`, `timezone`
  - Layanan: `service*` (`custom`/`recommend`/`consultation`/`management`)
  - Gambaran perjalanan: `travelWhen*`, `days*`, `cities`, `travelers*`, `travelerCount*`, `budget*`
  - Gaya: `style*` (grup), `accommodation`, `transport` (grup), `mustHave`, `avoid`, `firstVisit`
  - Kebutuhan & hasil: `specialNeeds` S, `occasion`, `format`, `itineraryLanguage`, `notes`, `policy*`
    (pembayaran di muka & batas revisi)
- **`learn`** — Booking Kelas Online (Google Meet)
  - Kontak: `fullName*`, `email*`, `whatsapp*`
  - Kelas: `class*`, `format*`, `level*`, `goals*` (grup), `experience`
  - Jadwal: `timezone*`, `preferredTime*`
  - Persetujuan: `policy*` (reschedule minimal 24 jam sebelum kelas)
- **`contact`** — Kontak Umum: `name*`, `email*`, `topic*`, `message*`

Kalau field diubah di sini, form, ringkasan WhatsApp, dan isi email otomatis ikut berubah. Tidak ada
salinan lain yang perlu disinkronkan.

## 2. Data yang dikirim ke Web3Forms

`POST https://api.web3forms.com/submit` dengan isi JSON berikut:

```json
{
  "access_key": "<SITE.web3formsKey>",
  "subject": "[NusaByIcha] <judul layanan> — <fullName atau name>",
  "from_name": "NusaByIcha website",
  "replyto": "<email>",
  "botcheck": false,
  "<Label field dalam bahasa aktif>": "<nilai yang ditampilkan; isi grup digabung dengan koma>"
}
```

- Kunci jawaban memakai **label** field dalam bahasa yang sedang aktif, bukan `name`. Akibatnya, email
  dari pengunjung berbahasa Inggris memakai label Inggris.
- Nilai opsi dikirim sebagai **label yang dibaca manusia**, bukan kode (misalnya "Multi-day (2 hari atau lebih)", bukan
  `multi`). Field yang kosong tidak dikirim.
- `botcheck` diambil dari checkbox honeypot. Kalau `true`, Web3Forms membuang kiriman itu.
- Ringkasan WhatsApp memakai pasangan label–nilai yang sama, dipotong di 1.500 karakter.
- Data pribadi yang terkirim: nama, email, nomor WhatsApp, dan isian bebas, termasuk field sensitif
  kalau diisi. Penyimpanan dan penghapusannya dijelaskan di `public/privacy.html` (paling lama 12 bulan).

## 3. Penyimpanan di browser (`localStorage`)

| Kunci                 | Nilai                                                                 | Ditulis oleh                |
| --------------------- | --------------------------------------------------------------------- | --------------------------- |
| `nusabyicha-language` | `id` / `en`                                                           | `setLanguage()` (`i18n.js`) |
| `nusabyicha-theme`    | `light` / `dark` (hanya diisi setelah pengunjung menekan tombol tema) | `initTheme()` (`ui.js`)     |

- Prefiks diatur di `SITE.storagePrefix`. Script tema inline di `<head>` menulis `nusabyicha-theme`
  secara langsung (tidak lewat `storagePrefix`). Kalau prefiksnya diganti, script itu dan hash CSP-nya
  juga harus diubah.
- Kunci lama `jelajahku-language` dan `jelajahku-theme` dipindahkan ke prefiks baru lalu dihapus saat
  pertama kali dibaca (`storage.js`).
- Tidak ada cookie, analytics, atau penyimpanan lain.

## 4. Teks dwibahasa (`public/js/translations.js`)

`translations = { id: {...}, en: {...} }`, dengan kunci yang harus sama persis di kedua bahasa (dicek
oleh `check.mjs`). Kunci yang berakhiran `Html` boleh berisi markup dan dipasang dengan `innerHTML`.
Teks form (label, opsi, judul) tidak ada di file ini. Teks itu ada di `forms.js` sebagai pasangan ID/EN.

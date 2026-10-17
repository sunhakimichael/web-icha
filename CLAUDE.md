# NusaByIcha (web-icha)

Situs personal satu halaman dua bahasa (ID/EN) milik Icha: pemandu lokal Jawa–Bali, perencana
perjalanan, dan guru bahasa. Dibuat dengan HTML/CSS/JS murni (ES modules, tanpa build) dan di-host di
Vercel: <https://web-icha.vercel.app>. Dokumentasi proyek ditulis dalam bahasa Indonesia.

## Perintah

Tidak ada langkah build atau instalasi. Yang dibutuhkan hanya Node 20+ dan python3.

```bash
./scripts/check.sh                   # cek statis: sintaks JS, file yang dirujuk, terjemahan, hash CSP, JSON, nomor WA
./scripts/check.sh --serve           # cek, lalu preview di http://127.0.0.1:3000
npx prettier@3.3.3 --check public    # cek format (CI juga menjalankan ini)
npx prettier@3.3.3 --write public    # rapikan format
```

- **Test:** belum ada framework test unit. CI (`.github/workflows/check.yml`) menjalankan `check.sh` dan
  Prettier. Perubahan tampilan diuji manual di browser: terang/gelap, lebar 375 px, keyboard.
- **Deploy:** setiap push ke `main` otomatis di-deploy Vercel. Jalankan `./scripts/check.sh` sebelum push.

## Knowledge base

Untuk memahami proyek, baca [`ai-doc/`](ai-doc/) lebih dulu:

- [overview.md](ai-doc/overview.md): fitur, peta file, placeholder yang sengaja dipertahankan,
  keterbatasan
- [tech-stack.md](ai-doc/tech-stack.md): teknologi, konfigurasi (`config.js`, `vercel.json`/CSP), cara
  menguji
- [logic-flow.md](ai-doc/logic-flow.md): alur saat halaman dimuat, bahasa/tema, modal form, Web3Forms dan
  WhatsApp
- [schema.md](ai-doc/schema.md): field form, isi kiriman Web3Forms, `localStorage`

**CODE WINS:** dokumen dipakai untuk orientasi, lalu cocokkan dengan kode. Kalau dokumen berbeda dengan
kode, kodenyalah yang benar. Perbaiki dokumennya dengan edit terarah, jangan ditulis ulang dari nol.

## Hal penting

- `public/` adalah satu-satunya sumber, dan isinya disajikan apa adanya.
- Data kontak (WA, key Web3Forms, IG, email) hanya ada di `public/js/config.js`.
- Kalau script inline di `<head>` diubah, hash CSP di `vercel.json` juga harus diperbarui (`check.sh`
  akan gagal kalau belum).
- Setiap teks baru wajib punya kunci di kedua bahasa di `translations.js`.
- Jangan hapus atau ganti label placeholder yang tercantum di `ai-doc/overview.md` tanpa persetujuan
  pemilik.

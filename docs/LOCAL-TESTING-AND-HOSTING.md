# Panduan lokal dan hosting web-icha

## 1. Menambah foto dan cerita Catatan Perjalanan

1. Simpan foto yang sudah disetujui di `public/`, misalnya `public/story-bali-coast.webp`.
2. Tambahkan satu `.story-card` di `index.html` dalam `.journal-grid`.
3. Isi `data-location` (`java`, `bali`, dan seterusnya) serta `data-year` empat digit agar filter lokasi/tahun berfungsi.
4. Tambahkan `alt` text yang menjelaskan lokasi dan suasana foto.
5. Tambahkan judul dan ringkasan dalam objek bahasa `id` dan `en` di `app.js`.
6. Sinkronkan file ke output publish dan validasi:

```bash
cp index.html styles.css app.js manus-routes.json public/
node --check app.js
node --check public/app.js
python3 -m json.tool public/manus-routes.json >/dev/null
```

Pertahankan tinggi `.story-image` agar semua kartu tetap seimbang.

## 2. Menguji perubahan secara lokal

Dari root repository:

```bash
python3 -m http.server 3000 --bind 127.0.0.1 --directory public
```

Buka `http://127.0.0.1:3000`, lalu cek:

- Hero dan foto profil tampil.
- Toggle ID/EN mengubah teks.
- Toggle dark mode bekerja.
- Filter Catatan Perjalanan bekerja berdasarkan lokasi dan tahun.
- Tombol layanan membuka form yang sesuai.
- Form wajib menolak submit kosong dan tombol WhatsApp mengarah ke nomor terbaru.

Periksa endpoint manifest di terminal lain:

```bash
curl -I http://127.0.0.1:3000/
curl http://127.0.0.1:3000/manus-routes.json
```

Jika semua sudah benar, hentikan server dengan `Ctrl+C`, lalu commit dan push:

```bash
git add .
git commit -m "Describe the change"
git push github main
```

## 3. Deploy otomatis ke Vercel

Vercel dapat membuat Preview Deployment untuk push/branch dan Production Deployment saat perubahan masuk ke production branch. Repository GitHub dapat dihubungkan dari **Vercel Dashboard → New Project**. [1]

1. Masuk ke [Vercel](https://vercel.com) dengan GitHub.
2. Pilih **Add New → Project**, lalu import `sunhakimichael/web-icha`.
3. Atur:
   - **Framework Preset:** `Other`
   - **Root Directory:** `.`
   - **Build Command:** kosongkan atau nonaktifkan override karena tidak ada proses build.
   - **Output Directory:** `public`
   - **Production Branch:** `main`
4. Klik **Deploy**.
5. Setelah itu setiap push ke `main` akan membuat deployment production; push ke branch lain dapat menghasilkan Preview Deployment. [1]

Untuk proyek HTML/CSS/JS tanpa build, Vercel menjelaskan bahwa preset `Other` dapat melayani folder `public` bila folder tersebut tersedia, atau output directory dapat diatur manual. [2]

## 4. Deploy otomatis ke Netlify

Netlify dapat menghubungkan repository GitHub dan menjalankan deploy setiap kali ada push ke Git provider. Pengaturan build dapat diisi saat membuat site atau melalui **Project configuration → Developer settings → Continuous deployment → Build settings**. [3]

1. Masuk ke [Netlify](https://app.netlify.com) dengan GitHub.
2. Pilih **Add new project → Import an existing project → GitHub**.
3. Pilih `sunhakimichael/web-icha`.
4. Atur:
   - **Base directory:** kosong / root repository.
   - **Build command:** `true`
   - **Publish directory:** `public`
   - **Production branch:** `main`
5. Klik **Deploy site**.
6. Setiap push ke `main` akan memicu build dan deploy otomatis selama builds aktif. [3]

Netlify juga dapat menyimpan pengaturan tersebut sebagai `netlify.toml` di root repository. Konsep `publish directory` adalah folder yang berisi file HTML dan asset siap deploy. [3]

Contoh `netlify.toml`:

```toml
[build]
  command = "true"
  publish = "public"
```

## 5. Alur kerja yang disarankan

Gunakan branch fitur untuk perubahan besar, uji secara lokal, lalu push ke GitHub. Biarkan Vercel atau Netlify membuat Preview Deployment. Setelah hasilnya disetujui, merge ke `main` untuk deployment production.

## Referensi resmi

[1]: https://vercel.com/docs/git "Deploying Git Repositories with Vercel"
[2]: https://vercel.com/docs/builds/configure-a-build "Configuring a Build on Vercel"
[3]: https://docs.netlify.com/build/configure-builds/overview/ "Netlify Build Configuration Overview"

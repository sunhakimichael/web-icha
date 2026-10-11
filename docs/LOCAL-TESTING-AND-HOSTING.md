# Panduan testing dan hosting web-icha

## 1. Menguji perubahan secara lokal

Dari root repository:

```bash
./scripts/check.sh --serve
```

Buka `http://127.0.0.1:3000`, lalu cek:

- Hero, foto profil, dan foto cerita tampil.
- Toggle ID/EN mengubah semua teks, termasuk form yang sedang terbuka (isian tidak hilang).
- Toggle mode gelap bekerja dan tidak berkedip saat halaman dimuat ulang.
- Filter Catatan Perjalanan bekerja per lokasi dan per tahun.
- Setiap tombol layanan membuka form yang sesuai. Form bisa diisi hanya dengan keyboard (Tab, Shift+Tab, Esc menutup dan fokus kembali ke tombol).
- Submit kosong ditolak, dan grup checkbox wajib menampilkan pesan.
- Submit lengkap:
  - **Mode WhatsApp** (`web3formsKey` kosong): WhatsApp terbuka dengan ringkasan isian.
  - **Mode Web3Forms**: email masuk ke Icha, lalu muncul layar sukses dengan tombol "Lanjut di WhatsApp". Coba juga dalam keadaan offline (DevTools → Network → Offline): harus muncul pesan error, tombol "Coba lagi", dan isian tetap ada.
- Uji di lebar ponsel (375 px). Field form tidak boleh membuat Safari iOS zoom.

## 2. Mengaktifkan pengiriman form (Web3Forms)

1. Buka <https://web3forms.com>, lalu masukkan **email Icha** untuk membuat access key. Key akan dikirim ke email tersebut.
2. Isi key di `public/js/config.js` → `web3formsKey`. Key ini memang dirancang untuk ditaruh di kode frontend.
3. Commit dan deploy, lalu kirim satu form percobaan dan pastikan email benar-benar masuk (cek juga folder spam).

## 3. Deploy ke Vercel

`vercel.json` di root sudah mengatur `outputDirectory: public`, header keamanan (CSP, dll.), dan cache. Langkahnya:

1. Masuk ke [Vercel](https://vercel.com) dengan GitHub.
2. **Add New → Project**, lalu import `sunhakimichael/web-icha`.
3. Framework Preset: `Other`. Pengaturan lain biarkan default, karena sudah diambil dari `vercel.json`.
4. Klik **Deploy**. Push ke `main` akan menjadi production, sedangkan push ke branch lain menghasilkan Preview Deployment.
5. Setelah domain final ditentukan (**Settings → Domains**), ganti `web-icha.vercel.app` di semua file (lihat README bagian *Konfigurasi*).

### Setelah deploy

- Bagikan link ke WhatsApp/Instagram dan pastikan pratinjau gambar (Open Graph) muncul. Kalau pratinjau lama masih tersimpan, cek ulang lewat <https://developers.facebook.com/tools/debug/>.
- Jalankan Lighthouse (Chrome DevTools → Lighthouse) untuk Performance, Accessibility, Best Practices, dan SEO.
- Buka DevTools → Console dan pastikan tidak ada pelanggaran CSP.

## 4. Alur kerja yang disarankan

Gunakan branch fitur, jalankan `./scripts/check.sh`, lalu push. GitHub Actions (`.github/workflows/check.yml`) menjalankan pemeriksaan yang sama plus cek format Prettier. Review hasilnya di Preview Deployment Vercel, lalu merge ke `main`.

# 🎵 TikTok Lite — Clone Fitur Inti

Aplikasi mirip TikTok dengan **fitur inti saja**, dibangun memakai teknologi
**paling ringan untuk APK**: HTML + CSS + JavaScript murni (tanpa framework),
dibungkus WebView Android sehingga APK hanya ±2–3 MB.

## ▶️ Preview
Jalankan server lokal lalu buka di browser (ideal: mode mobile / DevTools):

```bash
cd app
python3 -m http.server 8000 --bind 0.0.0.0
# buka http://localhost:8000
```

## ✨ Fitur inti yang tersedia
| Fitur | Status |
|---|---|
| Feed video vertikal full-screen (scroll snap) | ✅ |
| Autoplay video terlihat, pause saat keluar layar | ✅ |
| Tab **Mengikuti / Untuk Anda** + pencarian (ikon) | ✅ |
| **Like** (tombol & double-tap dengan animasi hati) | ✅ |
| **Komentar** — panel bawah, kirim komentar, like komentar | ✅ |
| **Bagikan** — sheet WhatsApp, FB, IG, salin tautan, dll | ✅ |
| **Follow** kreator (tombol + di avatar) | ✅ |
| Simpan/favorit, progress bar, tombol mute, jeda-tap | ✅ |
| Piringan musik berputar + judul lagu berjalan | ✅ |
| Bottom nav (Beranda, Teman, +, Kotak Masuk, Profil) | ✅ |

## 🗂 Struktur
```
app/                  # aplikasi web (HTML/CSS/JS murni — 0 dependensi)
  index.html
  css/app.css
  js/app.js
android/              # proyek wrapper WebView Android (Kotlin, 1 file)
  app/src/main/...    # MainActivity.kt, manifest, ikon, tema
  copy-assets.sh      # salin app/ → assets sebelum build
  BUILD-APK.md        # panduan build APK lengkap
```

## 📱 Build APK
Lihat **[android/BUILD-APK.md](android/BUILD-APK.md)** — bisa lewat Android Studio
(Build → Build APK(s)) atau `gradlew assembleDebug`. Video contoh memakai
sampel video publik Google; ganti daftar `POSTS` di `app/js/app.js` dengan
konten Anda sendiri.

## ⚠️ Catatan
Proyek ini demo edukasi (bukan TikTok resmi). Konten, nama, dan video hanyalah
contoh. Gunakan hanya untuk pembelajaran.

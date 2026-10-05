# 🎵 TikTok Lite — Clone Fitur Inti

Aplikasi mirip TikTok dengan **fitur inti saja**, dibangun memakai teknologi
**paling ringan untuk APK**: HTML + CSS + JavaScript murni (tanpa framework),
dibungkus WebView Android sehingga APK hanya ±3–5 MB (termasuk video demo).

## ▶️ Preview
```bash
cd app
python3 -m http.server 8000 --bind 0.0.0.0
# buka http://localhost:8000  (ideal: mode mobile / DevTools)
```
Video demo **dibundel lokal** (`app/media/*.mp4`, total ±380 KB) sehingga feed
pasti berputar tanpa internet; bila tersedia, CDN publik dipakai sebagai cadangan.

## ✨ Fitur inti
| Fitur | Status |
|---|---|
| Feed video vertikal full-screen (scroll snap, autoplay + pause otomatis) | ✅ |
| **Profil kreator & profil sendiri** (statistik, bio, grid video, tab disukai) | ✅ |
| **Unduh video** (di app: simpan ke folder Download; di APK: DownloadManager) | ✅ |
| Like (tombol & double-tap + animasi hati) | ✅ |
| Komentar — panel bawah, kirim komentar, like komentar | ✅ |
| Bagikan — sheet WhatsApp, FB, IG, Messenger, salin tautan | ✅ |
| Follow kreator (tombol + di avatar & tombol Ikuti di profil) | ✅ |
| Simpan/favorit, progress bar, mute, jeda-tap, ikon putar saat autoplay diblokir | ✅ |
| Multi-sumber video: lokal → CDN cadangan → tombol "Coba lagi" | ✅ |
| Piringan musik berputar + judul lagu berjalan, bottom nav khas TikTok | ✅ |

## 🗂 Struktur
```
app/                  # aplikasi web (HTML/CSS/JS murni — 0 dependensi)
  index.html
  css/app.css
  js/app.js
  media/v1..v8.mp4    # video demo vertikal 9:16 (±380 KB total)
android/              # proyek wrapper WebView Android (Kotlin, 1 file + bridge unduh)
  copy-assets.sh      # salin app/ → assets sebelum build
  BUILD-APK.md        # panduan build APK lengkap
tools/gen-videos.sh   # regenerasi video demo (butuh ffmpeg / otomatis via npm)
```

## 📊 Data referensi resmi TikTok
`data/tiktok-reference.json` berisi data yang diambil **langsung dari sumber publik
resmi** (2026-10-05): warna brand + Pantone (TikTok For Business Brand Guidelines),
terminologi produk (TikTok Newsroom), serta hashtag trending Indonesia
(TokChart & TikTok Discover). Data dipakai aplikasi untuk sheet **Sedang Tren**
(ikon 🔍), token warna brand, dan string UI (lihat `app/js/data.js`,
dibangkitkan oleh `tools/build-data.js` — jangan edit manual).
Catatan: API privat aplikasi resmi butuh autentikasi & dilarang ToS, jadi hanya
sumber publik resmi yang diambil.

## 📡 Fetch LIVE dari API TikTok (oEmbed)
`data/tiktok-api-oembed.json` = snapshot respons **API resmi publik**
`GET https://www.tiktok.com/oembed?url=<video>` (skema lengkap: title,
author_name/url, thumbnail_url, provider, dimensi). Di dalam app (sheet 🔍 →
blok "API TikTok"):
- **APK**: jembatan native `TikTokApi.oembed()` mem-fetch endpoint resmi secara
  LIVE (tanpa batas CORS) → badge **LIVE**.
- **Browser**: `fetch` langsung; bila CORS/jaringan menolak → jatuh kembali ke
  **snapshot** ber-tanggal.
- Item diklik → membuka video asli di TikTok.

## 🤖 GitHub CI (Actions)
`.github/workflows/ci.yml` berjalan otomatis di tiap push/PR:
1. **validate-data** — cek konsistensi `data.js` ↔ `tiktok-reference.json`
2. **build-apk** — build APK Android (Gradle 8.7 + JDK 17), upload artifact `TikTokLite-APK-debug`
3. **deploy-web** — deploy aplikasi web ke **GitHub Pages**

Unduh APK dari tab **Actions → run terakhir → Artifacts**.

## 📱 Build APK
Lihat **[android/BUILD-APK.md](android/BUILD-APK.md)**:
```bash
cd android && bash copy-assets.sh   # lalu Build → Build APK(s) di Android Studio
```
Konten Anda sendiri? Ganti daftar `POSTS` di `app/js/app.js` (field `media`
untuk file lokal, `remote` untuk URL CDN).

## ⚠️ Catatan
Proyek ini demo edukasi (bukan TikTok resmi). Konten, nama, dan video hanyalah
contoh — gunakan untuk pembelajaran.

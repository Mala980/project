# 📱 Cara Build APK TikTok Lite (±2–3 MB)

Strategi paling ringan: seluruh aplikasi ditulis dengan **HTML + CSS + JavaScript murni**
(folder `../app`), lalu dibungkus **WebView Android** tanpa framework apa pun.
Hasilnya APK hanya ±2–3 MB — jauh lebih kecil dibanding Flutter (±20 MB) atau
React Native (±15 MB).

## Prasyarat
- [Android Studio](https://developer.android.com/studio) (atau JDK 17 + Android SDK CLI)

## Langkah-langkah

```bash
cd android
bash copy-assets.sh        # 1. salin aplikasi web ke app/src/main/assets
```

### Opsi A — Android Studio (paling mudah)
1. Buka Android Studio → **Open** → pilih folder `android/`
2. Tunggu Gradle sync selesai
3. Menu **Build → Build App Bundle(s) / APK(s) → Build APK(s)**
4. APK ada di `app/build/outputs/apk/debug/app-debug.apk`

### Opsi B — Command line
```bash
cd android
gradle wrapper --gradle-version 8.7   # sekali saja (butuh gradle terpasang)
./gradlew assembleDebug                # APK debug
./gradlew assembleRelease              # APK release (minified, lebih kecil)
```

> Jika belum punya Gradle, pakai cara Opsi A — Android Studio menyediakan
> Gradle bawaan otomatis.

## Rincian teknis
| Item | Nilai |
|---|---|
| minSdk | 24 (Android 7.0, mencakup ±98% perangkat) |
| targetSdk | 34 |
| Bahasa wrapper | Kotlin (1 file, ±60 baris) |
| Bahasa aplikasi | HTML/CSS/JS murni, 0 dependensi npm |
| Perizinan | `INTERNET` (+ penyimpanan utk unduhan, API ≤28) |
| Ukuran APK | ±4–5 MB (debug, termasuk video demo), kecil tanpa media |

## Alternatif tanpa Android Studio
- **Median.co / GoNative** — upload URL web, dapat APK instan.
- **AppsGeyser** — konverter web→APK gratis.
- **Unduhan di APK**: tombol "Unduh video" memakai `AndroidBridge`
  (DownloadManager untuk URL https, penyalinan aset untuk video lokal).

- **Capacitor** (`npm i @capacitor/core @capacitor/cli && npx cap init && npx cap add android`)
  jika kelak butuh plugin native (kamera, push, dll).

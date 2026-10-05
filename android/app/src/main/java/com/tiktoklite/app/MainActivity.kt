package com.tiktoklite.app

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import java.io.File

/**
 * TikTok Lite — wrapper WebView minimal.
 * Seluruh logika aplikasi ada di assets/ (HTML/CSS/JS murni + video lokal),
 * sehingga APK tetap sangat kecil (±3–5 MB).
 */
class MainActivity : AppCompatActivity() {

    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        web = WebView(this)
        setContentView(web)

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false // autoplay video feed
            useWideViewPort = true
            loadWithOverviewMode = true
            allowFileAccess = true
            @Suppress("DEPRECATION")
            allowFileAccessFromFileURLs = true
            @Suppress("DEPRECATION")
            allowUniversalAccessFromFileURLs = true
        }

        web.webViewClient = WebViewClient()
        web.webChromeClient = WebChromeClient() // dukungan fullscreen video
        web.setBackgroundColor(0xFF000000.toInt())
        web.addJavascriptInterface(DownloadBridge(this), "AndroidBridge")
        web.loadUrl("file:///android_asset/index.html")

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // Tutup sheet/profil lewat JS jika terbuka, selain itu keluar
                val handled = web.evaluateJavascript(
                    "(function(){ if(document.querySelector('.sheet.open')||document.querySelector('#profile-page.open')){" +
                    " document.querySelectorAll('.sheet').forEach(s=>s.classList.remove('open'));" +
                    " document.getElementById('overlay').classList.remove('show');" +
                    " document.getElementById('profile-page').classList.remove('open'); return 1;} return 0;})()"
                ) { v -> if (v == "0") finish() }
                if (handled == null) finish()
            }
        })
    }

    override fun onDestroy() {
        web.destroy()
        super.onDestroy()
    }
}

/**
 * Bridge JS → native untuk fitur UNDUH video.
 * - download()      : URL https → DownloadManager
 * - downloadAsset() : aset lokal (media/vN.mp4) → disalin ke folder Downloads
 */
class DownloadBridge(private val ctx: Context) {

    private val main = Handler(Looper.getMainLooper())

    @JavascriptInterface
    fun hasAsset(url: String): Boolean = url.startsWith("media/")

    @JavascriptInterface
    fun download(url: String, filename: String) {
        try {
            val dm = ctx.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            val req = DownloadManager.Request(Uri.parse(url))
                .setTitle(filename)
                .setDescription("TikTok Lite")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            @Suppress("DEPRECATION")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename)
            } else {
                req.setDestinationInExternalFilesDir(ctx, Environment.DIRECTORY_DOWNLOADS, filename)
            }
            dm.enqueue(req)
            toast("⬇️ Mengunduh $filename")
        } catch (e: Exception) {
            ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
        }
    }

    @JavascriptInterface
    fun downloadAsset(relPath: String, filename: String) {
        Thread {
            try {
                ctx.assets.open(relPath).use { ins ->
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        val resolver = ctx.contentResolver
                        val values = android.content.ContentValues().apply {
                            put(MediaStore.Downloads.DISPLAY_NAME, filename)
                            put(MediaStore.Downloads.MIME_TYPE, "video/mp4")
                            put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                        }
                        val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)!!
                        resolver.openOutputStream(uri)!!.use { out -> ins.copyTo(out) }
                    } else {
                        val dir = ctx.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)!!
                        File(dir, filename).outputStream().use { out -> ins.copyTo(out) }
                    }
                }
                toast("✅ $filename tersimpan di Download")
            } catch (e: Exception) {
                toast("Gagal menyimpan: ${e.message}")
            }
        }.start()
    }

    private fun toast(msg: String) = main.post { Toast.makeText(ctx, msg, Toast.LENGTH_SHORT).show() }
}

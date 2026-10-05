# ProGuard: pertahankan WebView + klien JavaScript bridge
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface

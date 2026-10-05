/* ============================================================
   TikTok Lite — vanilla JS, zero dependencies
   Fitur inti: feed vertikal, like, komentar, share+unduh,
   follow, profil kreator & profil sendiri, progress bar,
   double-tap like, mute, autoplay + fallback multi-sumber.
   ============================================================ */
"use strict";

/* Video: sumber LOKAL (dibundel, pasti jalan) + cadangan CDN publik */
const REMOTE = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://download.samplelib.com/mp4/sample-10s.mp4",
];

const POSTS = [
  { user:"bigbuckbunny.id",  name:"Big Buck Bunny",   media:"media/v1.mp4", remote:REMOTE[0]+"BigBuckBunny.mp4", hue:210,
    cap:"Pagi hari di hutan yang damai 🐰✨ Siapa yang relate? #animasi #fyp #santaisore", song:"suara asli - Big Buck Bunny",
    likes:1543000, comments:2384, shares:45210, saves:89300, bio:"Akun penggemar animasi 🐰 | Upload tiap Jumat" },
  { user:"dj.viral99",       name:"DJ Viral",         media:"media/v2.mp4", remote:REMOTE[1], hue:330,
    cap:"Sound ini lagi naik terus 🔥🔊 Pakai sound ini biar masuk FYP! #djremix #viral2026 #jedagjedug", song:"DJ Remix Viral 2026 - dj.viral99",
    likes:3200000, comments:18400, shares:210500, saves:452100, bio:"DJ & produser 🎧 Booking: djviral@mail.com" },
  { user:"jalanjalan.yuk",   name:"Jalan Jalan Yuk",  media:"media/v3.mp4", remote:REMOTE[2], hue:160,
    cap:"POV: kamu akhirnya liburan setelah 3 bulan kerja 💼✈️ #travel #healing #pantai", song:"Sunset Vibes - Chill Beats",
    likes:876400, comments:5620, shares:23100, saves:67800, bio:"Keliling Indonesia 🇮 34/38 provinsi" },
  { user:"kucingorem",       name:"Kucing Orem",      media:"media/v4.mp4", remote:REMOTE[0]+"ForBiggerFun.mp4", hue:35,
    cap:"Definisi bahagia itu sederhana 😹🐱 Tag teman kamu yang kayak gini! #kucing #catsoftiktok #lucu", song:"suara asli - Kucing Orem",
    likes:5600000, comments:42300, shares:512000, saves:1200000, bio:"Manusia dari 3 ekor kucing 🐾" },
  { user:"otomotif.gas",     name:"Otomotif Gas",     media:"media/v5.mp4", remote:REMOTE[0]+"SubaruOutbackOnStreetAndDirt.mp4", hue:15,
    cap:"Tes jalur ekstrem hari ini 🚗💨 Kira-kira lolos nggak ya? #otomotif #offroad #seru", song:"Engine Roar - Sound Library",
    likes:432000, comments:3210, shares:12700, saves:21500, bio:"Review jujur otomotif | Test drive tiap minggu" },
  { user:"film.pendek",      name:"Film Pendek ID",   media:"media/v6.mp4", remote:REMOTE[0]+"TearsOfSteel.mp4", hue:265,
    cap:"Episode 3 sudah tayang 🎬 Jangan lupa follow biar nggak ketinggalan! #filmindonesia #webseries #drama", song:"Original Score - Film Pendek ID",
    likes:1980000, comments:12700, shares:88400, saves:301200, bio:"Rumah sineas muda 🎬 Karya anak bangsa" },
  { user:"animasi.nusantara",name:"Animasi Nusantara",media:"media/v7.mp4", remote:REMOTE[0]+"ElephantsDream.mp4", hue:190,
    cap:"Karya anak bangsa, bangga nggak? 🇮🇩❤️ Share kalau kalian bangga! #animasi #karyalokal #bangga", song:"suara asli - Animasi Nusantara",
    likes:2450000, comments:9800, shares:156000, saves:234000, bio:"Studio animasi independen ✨" },
  { user:"resep.emak",       name:"Resep Emak",       media:"media/v8.mp4", remote:REMOTE[0]+"ForBiggerJoyrides.mp4", hue:95,
    cap:"5 menit langsung jadi! Resep rahasia keluarga nih 🍜😋 #kuliner #resepviral #masaksimple", song:"suara asli - Resep Emak",
    likes:743000, comments:6540, shares:31800, saves:158700, bio:"Masak gampang, enak, murah 🍳" },
];

const COMMENT_POOL = [
  ["rizky.pratama","Baru nemu akun ini, langsung follow! 🔥","2 j"],
  ["salsabila_","Keren banget sih ini 😭❤️","3 j"],
  ["budi.santoso88","Info lengkapnya dong kak, penasaran","5 j"],
  ["nabila.citra","Udah 5 kali nonton dan nggak bosen 😂","6 j"],
  ["dimasanggara","Definisi konten berkualitas 👏👏","8 j"],
  ["ayupuspita_","Relate banget sama ini, nangis aku 🥹","10 j"],
  ["fajar_sidiq","Soundnya apa kak? Bagus banget","12 j"],
  ["intan.permata","Wajib masuk FYP ini sih ✨","1 h"],
  ["yoga.prasetyo","Lanjut part 2 dong kak 🙏","1 h"],
  ["melati.suci","Baru liat dan langsung share ke grup WA 😆","2 h"],
];

const SHARE_TARGETS = [
  { n:"Unduh video",   c:"#16a34a", act:"download", svg:"M11 3h2v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4L11 13.2V3ZM4 19h16v2H4v-2Z" },
  { n:"WhatsApp",      c:"#25D366", svg:"M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.7 14.2c-.24.7-1.4 1.3-2 1.4-.5.1-1.1.2-3.3-.7-2.8-1.2-4.6-4-4.8-4.2-.13-.2-1.15-1.55-1.15-3 0-1.4.72-2.06.98-2.34.26-.28.57-.35.76-.35h.55c.17 0 .41-.06.64.49.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.09.19-.14.3-.28.47l-.42.5c-.14.14-.29.3-.13.58.17.29.74 1.23 1.6 2 1.1.97 2.02 1.27 2.3 1.41.29.14.46.12.63-.07.16-.19.72-.84.9-1.13.2-.29.38-.24.64-.14.26.09 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.7-.17 1.38Z" },
  { n:"Facebook",      c:"#1877F2", svg:"M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.25-1.55 1.58-1.55h1.68V4.3c-.3-.04-1.3-.13-2.46-.13-2.44 0-4.1 1.5-4.1 4.23v2.4H7.5V14h2.7v8h3.3Z" },
  { n:"Messenger",     c:"#A334FA", svg:"M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.6 7.2V22l3.3-1.8c.97.27 2 .42 3.1.42 5.5 0 10-4.1 10-9.3S17.5 2 12 2Zm1.1 12.5-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7-5.4 5.8Z" },
  { n:"Pesan",         c:"#34C759", svg:"M12 3C6.5 3 2 6.9 2 11.7c0 2.7 1.4 5.1 3.6 6.7-.16 1.1-.66 2.2-1.6 3.1 1.6-.13 3-.65 4.1-1.3 1.2.36 2.5.55 3.9.55 5.5 0 10-3.9 10-8.7S17.5 3 12 3Zm-4.5 7h9v1.8h-9V10Z" },
  { n:"Instagram",     c:"#E1306C", svg:"M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Zm0 2a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8Zm9.5 1.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" },
  { n:"Salin tautan",  c:"#3f3f46", act:"copy", svg:"M10.6 13.4a1 1 0 0 0 1.4 1.4l4.9-4.9a3.5 3.5 0 0 0-4.9-4.9L9.8 7.2a1 1 0 1 0 1.4 1.4l2.2-2.2a1.5 1.5 0 0 1 2.1 2.1l-4.9 4.9Zm2.8-2.8a1 1 0 0 0-1.4-1.4L7.1 14.1a3.5 3.5 0 0 0 4.9 4.9l2.2-2.2a1 1 0 1 0-1.4-1.4l-2.2 2.2a1.5 1.5 0 0 1-2.1-2.1l4.9-4.9Z" },
  { n:"Lainnya",       c:"#71717a", svg:"M5 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" },
];

const ICONS = {
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.8-4.9-10.2-9.2C.2 8.9 2 5 5.6 5c2.2 0 3.4 1.2 4.4 2.6l2 2.7 2-2.7C15 6.2 16.2 5 18.4 5c3.6 0 5.4 3.9 3.8 6.8C19.8 16.1 12 21 12 21Z"/></svg>',
  comment: '<svg viewBox="0 0 24 24"><path d="M12 2.5C6.2 2.5 1.5 6.7 1.5 11.9c0 2.9 1.5 5.6 3.9 7.3l-.9 3 3.3-1.7c1.3.4 2.7.6 4.2.6 5.8 0 10.5-4.2 10.5-9.4S17.8 2.5 12 2.5Z"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M6 2h12a1 1 0 0 1 1 1v18.3a.7.7 0 0 1-1.1.6L12 17.6l-5.9 4.3A.7.7 0 0 1 5 21.3V3a1 1 0 0 1 1-1Z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M14.5 3.2 22.4 10a1 1 0 0 1 0 1.5l-7.9 6.8c-.6.6-1.7.1-1.7-.8v-3c-5.3.2-8.9 2.1-10.6 5.8-.3.6-1.2.5-1.3-.2C.4 12.3 4.7 6.9 12.8 6.2v-2.2c0-.9 1-1.4 1.7-.8Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m9.5 16.2-3.7-3.7L4.4 14l5.1 5.1 9.1-9.1-1.4-1.4-7.7 7.6Z"/></svg>',
  note: '<svg viewBox="0 0 24 24"><path d="M19 3h.5v13.2a3.3 3.3 0 1 1-2-3V6.9L9 8.6v8.1a3.3 3.3 0 1 1-2-3V6.4a1.5 1.5 0 0 1 1.2-1.5L19 3Z"/></svg>',
  warn: '<svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2Zm0 6 7.5 11h-15L12 8Zm-1 3h2v4h-2v-4Zm0 5h2v2h-2v-2Z"/></svg>',
};

/* ---------- helpers ---------- */
const $ = (s, r=document) => r.querySelector(s);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const fmt = n => {
  if (n >= 1e6) return (n/1e6).toFixed(1).replace(".", ",").replace(",0","") + " jt";
  if (n >= 1e4) return (n/1e3).toFixed(1).replace(".", ",").replace(",0","") + " rb";
  return n.toLocaleString("id-ID");
};
const initials = u => u.replace(/[^a-zA-Z]/g,"").slice(0,1).toUpperCase() || "T";

let toastTimer;
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2100);
}

/* ---------- global state ---------- */
let globalMuted = true;
let activeSlide = null;
let currentCommentPost = null;
let profileTarget = null;

/* ---------- data referensi resmi TikTok (app/js/data.js) ---------- */
const REF = window.TIKTOK_DATA || null;
if (REF) {
  const c = REF.brand.colors;
  document.documentElement.style.setProperty("--pink", c.razzmatazz.hex);
  document.documentElement.style.setProperty("--cyan", c.splash.hex);
  const L = REF.ui_strings["id-ID"];
  const put = (sel, txt) => { const n = document.querySelector(sel); if (n) n.textContent = txt; };
  put('.tab[data-tab="following"]', L.mengikuti);
  put('.tab[data-tab="foryou"]', L.untuk_anda);
  put('.navbtn[data-nav="home"] span', L.beranda);
  put('.navbtn[data-nav="friends"] span', L.teman);
  put('.navbtn[data-nav="inbox"] span', L.kotak_masuk);
  put('.navbtn[data-nav="profile"] span', L.profil);
  put('#trend-title', L.sedang_tren);
  document.querySelector("#comment-text")?.setAttribute("placeholder", L.tambahkan_komentar);
}

/* ---------- build feed ---------- */
const feed = $("#feed");

POSTS.forEach((p, i) => {
  p.liked = false; p.saved = false; p.following = false;
  p._likes = p.likes; p._saves = p.saves;
  p.commentList = [];
  p.sources = [p.media, p.remote];
  p._srcI = 0; p.currentSrc = p.media;

  const slide = el("section","slide");
  slide.dataset.i = i;
  slide.innerHTML = `
    <video loop playsinline preload="metadata" muted src="${p.sources[0]}"></video>
    <div class="loader"></div>
    <div class="shade-top"></div><div class="shade-bottom"></div>

    <div class="rail">
      <div class="avatar-wrap">
        <button class="avatar open-profile" style="background:hsl(${p.hue} 65% 45%)" aria-label="Profil ${p.user}">${initials(p.user)}</button>
        <button class="follow-plus" aria-label="Ikuti">${ICONS.plus}</button>
      </div>
      <button class="rail-item like-btn">${ICONS.heart}<span class="cnt">${fmt(p._likes)}</span></button>
      <button class="rail-item comment-btn">${ICONS.comment}<span class="cnt">${fmt(p.comments)}</span></button>
      <button class="rail-item save-btn">${ICONS.save}<span class="cnt">${fmt(p._saves)}</span></button>
      <button class="rail-item share-btn">${ICONS.share}<span class="cnt">${fmt(p.shares)}</span></button>
      <div class="vinyl"><div class="disc" style="background:hsl(${(p.hue+40)%360} 70% 55%)">♪</div></div>
    </div>

    <div class="meta">
      <div class="user open-profile">@${p.user}</div>
      <div class="cap">${p.cap.replace(/#(\w[\w.]*)/g,'<span class="tag">#$1</span>')}</div>
      <div class="music">${ICONS.note}<div class="marquee"><span>${p.song} &nbsp;•&nbsp; ${p.song} &nbsp;•&nbsp; </span></div></div>
    </div>
    <div class="progress"><i></i></div>
    <div class="vid-err" hidden>${ICONS.warn}<p>Video gagal dimuat.<br>Periksa koneksi internet kamu.</p><button class="vid-retry">Coba lagi</button></div>`;

  const video = $("video", slide);
  const loader = $(".loader", slide);
  const errBox = $(".vid-err", slide);

  video.addEventListener("loadeddata", () => loader.hidden = true);
  video.addEventListener("playing", () => {
    loader.hidden = true; errBox.hidden = true; $("#pause-icon").hidden = true;
  });
  video.addEventListener("timeupdate", () => {
    if (video.duration) $(".progress i", slide).style.width = (video.currentTime/video.duration*100) + "%";
  });
  /* fallback multi-sumber: jika sumber gagal, coba berikutnya */
  video.addEventListener("error", () => {
    p._srcI++;
    if (p._srcI < p.sources.length) {
      toast("Sumber video bermasalah, beralih ke cadangan…");
      video.src = p.sources[p._srcI];
      video.load();
      if (activeSlide === slide) video.play().catch(() => {});
    } else {
      loader.hidden = true;
      errBox.hidden = false;
    }
  });
  $(".vid-retry", slide).addEventListener("click", e => {
    e.stopPropagation();
    p._srcI = 0;
    errBox.hidden = true; loader.hidden = false;
    video.src = p.sources[0];
    video.load();
    video.play().catch(() => {});
  });

  /* profil kreator */
  slide.querySelectorAll(".open-profile").forEach(b =>
    b.addEventListener("click", e => { e.stopPropagation(); openProfile(p); }));

  /* follow */
  $(".follow-plus", slide).addEventListener("click", e => {
    e.stopPropagation();
    setFollowing(p, !p.following);
    toast(p.following ? `Berhasil mengikuti @${p.user}` : `Berhenti mengikuti @${p.user}`);
  });

  /* like */
  $(".like-btn", slide).addEventListener("click", e => { e.stopPropagation(); toggleLike(p, slide); });

  /* save */
  const saveBtn = $(".save-btn", slide);
  saveBtn.addEventListener("click", e => {
    e.stopPropagation();
    p.saved = !p.saved;
    p._saves += p.saved ? 1 : -1;
    saveBtn.classList.toggle("saved", p.saved);
    $(".cnt", saveBtn).textContent = fmt(p._saves);
    toast(p.saved ? "Disimpan ke favorit" : "Dihapus dari favorit");
  });

  /* comments */
  $(".comment-btn", slide).addEventListener("click", e => { e.stopPropagation(); openComments(p); });

  /* share + download */
  $(".share-btn", slide).addEventListener("click", e => { e.stopPropagation(); openShare(p); });

  /* tap / double tap on video area */
  let lastTap = 0, tapTimer = null;
  slide.addEventListener("click", e => {
    if (e.target.closest(".rail,.meta,.follow-plus,.vid-err")) return;
    const now = Date.now();
    if (now - lastTap < 290) {
      clearTimeout(tapTimer); lastTap = 0;
      doubleTapLike(slide, p, e.clientX, e.clientY);
      return;
    }
    lastTap = now;
    tapTimer = setTimeout(() => togglePlay(slide), 290);
  });

  feed.appendChild(slide);
});

/* ---------- interactions ---------- */
function toggleLike(p, slide){
  p.liked = !p.liked;
  p._likes += p.liked ? 1 : -1;
  const b = $(".like-btn", slide);
  b.classList.toggle("liked", p.liked);
  $(".cnt", b).textContent = fmt(p._likes);
}

function setFollowing(p, val){
  p.following = val;
  const b = $(".follow-plus", feed.children[POSTS.indexOf(p)]);
  b.classList.toggle("followed", val);
  b.innerHTML = val ? ICONS.check : ICONS.plus;
  if (profileTarget === p) renderProfileActions(p);
}

function doubleTapLike(slide, p, x, y){
  const phone = $("#phone").getBoundingClientRect();
  if (!p.liked) toggleLike(p, slide);
  const h = el("div","float-heart", ICONS.heart);
  h.style.left = (x - phone.left) + "px";
  h.style.top  = (y - phone.top) + "px";
  slide.appendChild(h);
  h.addEventListener("animationend", () => h.remove());
  if (navigator.vibrate) navigator.vibrate(12);
}

function togglePlay(slide){
  const v = $("video", slide);
  const ic = $("#pause-icon");
  if (v.paused) {
    v.play().catch(() => toast("Ketuk lagi untuk memutar"));
    ic.hidden = true;
  } else {
    v.pause();
    ic.hidden = false;
    ic.style.animation = "none"; void ic.offsetWidth; ic.style.animation = "";
    slide.appendChild(ic);
  }
}

/* ---------- playback control ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    const slide = en.target, v = $("video", slide);
    if (en.isIntersecting && en.intersectionRatio > 0.6) {
      activeSlide = slide;
      v.muted = globalMuted;
      v.play().catch(() => {
        /* autoplay diblokir (mis. iframe): tampilkan ikon putar, tap untuk main */
        $("#pause-icon").hidden = false;
        slide.appendChild($("#pause-icon"));
      });
      slide.classList.add("playing");
    } else {
      v.pause();
      slide.classList.remove("playing");
      if (activeSlide === slide) activeSlide = null;
    }
  });
}, { root: feed, threshold: [0, 0.65, 1] });
document.querySelectorAll(".slide").forEach(s => io.observe(s));

/* ---------- mute ---------- */
$("#btn-mute").addEventListener("click", () => {
  globalMuted = !globalMuted;
  $("#btn-mute").classList.toggle("unmuted", !globalMuted);
  document.querySelectorAll(".slide video").forEach(v => v.muted = globalMuted);
  toast(globalMuted ? "Suara dimatikan" : "Suara dinyalakan");
});

/* ---------- top tabs ---------- */
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  if (t.dataset.tab === "following") toast("Feed 'Mengikuti' kosong — ikuti kreator dulu ya!");
  feed.scrollTo({ top: 0, behavior: "smooth" });
}));

/* ============ TRENDING (data referensi resmi TikTok) ============ */
$("#btn-search").addEventListener("click", openTrend);
$("#btn-close-trend").addEventListener("click", closeSheets);
function openTrend(){
  const list = $("#trend-list");
  list.innerHTML = "";
  (REF?.trending?.indonesia || []).forEach((t, i) => {
    const row = el("button","trend-item");
    row.innerHTML = `<span class="rank">${i+1}</span>
      <div class="t-body"><div class="t-tag">#${t.tag}</div>
      <div class="t-meta">${t.videos} video · ${t.views}x ditonton</div></div>`;
    row.addEventListener("click", () => toast(`Menjelajahi #${t.tag} (demo)`));
    list.appendChild(row);
  });
  const chips = $("#trend-chips");
  chips.innerHTML = "";
  (REF?.trending?.fyp_indonesia || []).forEach(tag => {
    const b = el("button","chip","#" + tag);
    b.addEventListener("click", () => toast(`Menjelajahi #${tag} (demo)`));
    chips.appendChild(b);
  });
  $("#trend-sheet").classList.add("open");
  $("#overlay").classList.add("show");
}

/* ============ COMMENTS ============ */
function openComments(p){
  currentCommentPost = p;
  const list = $("#comments-list");
  list.innerHTML = "";
  if (!p.commentList.length) {
    const n = 4 + (p.likes % 4);
    for (let k = 0; k < n; k++) {
      const c = COMMENT_POOL[(POSTS.indexOf(p) * 3 + k * 2) % COMMENT_POOL.length];
      p.commentList.push({ user:c[0], text:c[1], time:c[2], likes:Math.floor(Math.random()*900)+5, liked:false, hue:(c[0].length*47)%360 });
    }
  }
  p.commentList.forEach(c => list.appendChild(commentNode(p, c)));
  $("#comments-title").textContent = `${fmt(p.comments)} komentar`;
  $("#comments-sheet").classList.add("open");
  $("#overlay").classList.add("show");
}
function commentNode(p, c){
  const row = el("div","comment");
  row.innerHTML = `
    <div class="c-avatar" style="background:hsl(${c.hue} 55% 45%)">${initials(c.user)}</div>
    <div class="c-body">
      <div class="c-name">${c.user}</div>
      <div class="c-text">${c.text}</div>
      <div class="c-time">${c.time} <b>Balas</b></div>
    </div>
    <button class="c-like ${c.liked ? "liked":""}">${ICONS.heart}<span>${fmt(c.likes)}</span></button>`;
  $(".c-like", row).addEventListener("click", () => {
    c.liked = !c.liked;
    c.likes += c.liked ? 1 : -1;
    $(".c-like", row).classList.toggle("liked", c.liked);
    $(".c-like span", row).textContent = fmt(c.likes);
  });
  return row;
}
function closeSheets(){
  document.querySelectorAll(".sheet").forEach(s => s.classList.remove("open"));
  $("#overlay").classList.remove("show");
}
$("#btn-close-comments").addEventListener("click", closeSheets);
$("#overlay").addEventListener("click", closeSheets);

const cInput = $("#comment-text");
cInput.addEventListener("input", () => $("#comment-send").classList.toggle("ready", !!cInput.value.trim()));
function sendComment(){
  const text = cInput.value.trim();
  if (!text || !currentCommentPost) return;
  const p = currentCommentPost;
  const c = { user:"kamu", text, time:"Baru saja", likes:0, liked:false, hue:217 };
  p.commentList.unshift(c);
  p.comments += 1;
  $("#comments-list").prepend(commentNode(p, c));
  $("#comments-title").textContent = `${fmt(p.comments)} komentar`;
  $(".comment-btn .cnt", feed.children[POSTS.indexOf(p)]).textContent = fmt(p.comments);
  cInput.value = "";
  $("#comment-send").classList.remove("ready");
  $("#comments-list").scrollTop = 0;
}
$("#comment-send").addEventListener("click", sendComment);
cInput.addEventListener("keydown", e => { if (e.key === "Enter") sendComment(); });

/* ============ SHARE + DOWNLOAD ============ */
function openShare(p){
  const row = $("#share-row");
  row.innerHTML = "";
  SHARE_TARGETS.forEach(t => {
    const item = el("button","share-item");
    item.innerHTML = `<div class="share-ic" style="background:${t.c}"><svg viewBox="0 0 24 24"><path d="${t.svg}"/></svg></div><span>${t.n}</span>`;
    item.addEventListener("click", () => {
      if (t.act === "download") { downloadVideo(p); }
      else if (t.act === "copy") {
        const link = location.href.split("#")[0] + "?v=" + POSTS.indexOf(p);
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(link).then(() => toast("Tautan disalin!"), () => toast(link));
        else toast(link);
      } else toast(`Dibagikan ke ${t.n} (demo)`);
      closeSheets();
    });
    row.appendChild(item);
  });
  $("#share-sheet").classList.add("open");
  $("#overlay").classList.add("show");
}
$("#btn-cancel-share").addEventListener("click", closeSheets);

/* Unduh video: via bridge Android (DownloadManager/asset) atau fetch+blob di browser */
async function downloadVideo(p){
  const url = p.currentSrc || p.sources[p._srcI] || p.sources[0];
  const filename = `TikTokLite_${p.user}.mp4`;
  if (window.AndroidBridge) {
    try {
      if (window.AndroidBridge.hasAsset && AndroidBridge.hasAsset(url)) AndroidBridge.downloadAsset(url, filename);
      else AndroidBridge.download(url, filename);
      toast("⬇️ Mengunduh… cek notifikasi / folder Download");
      return;
    } catch (e) { /* lanjut ke fallback web */ }
  }
  toast("⬇️ Menyiapkan unduhan video…");
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const blob = await res.blob();
    const a = document.createElement("a");
    const href = URL.createObjectURL(blob);
    a.href = href; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 5000);
    toast("✅ Video tersimpan!");
  } catch (e) {
    window.open(url, "_blank");
    toast("Unduhan dibuka di tab baru — simpan dari sana");
  }
}

/* ============ PROFILE ============ */
const pp = $("#profile-page");
let ppTab = "videos";

function openProfile(target){
  profileTarget = target;
  ppTab = "videos";
  renderProfile();
  pp.classList.add("open");
}
function closeProfile(){
  pp.classList.remove("open");
  profileTarget = null;
}
$("#pp-back").addEventListener("click", closeProfile);

document.querySelectorAll(".pp-tab").forEach(t => t.addEventListener("click", () => {
  ppTab = t.dataset.ptab;
  document.querySelectorAll(".pp-tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  renderProfileBody();
}));

function renderProfile(){
  const isMe = profileTarget === "me";
  const p = isMe ? null : profileTarget;
  document.querySelectorAll(".pp-tab").forEach((x,i) => x.classList.toggle("active", i === 0));

  $("#pp-title").textContent = isMe ? "Profil" : "@" + p.user;
  $("#pp-avatar").textContent = isMe ? "S" : initials(p.user);
  $("#pp-avatar").style.background = isMe ? "#3a86ff" : `hsl(${p.hue} 65% 45%)`;
  $("#pp-name").textContent = isMe ? "@kamu" : "@" + p.user;

  const followingN = isMe ? POSTS.filter(x => x.following).length : 40 + (p.hue % 180);
  const followersN = isMe ? 1245 : Math.round(p.likes / 7) + 12345;
  const likesN     = isMe ? POSTS.reduce((s,x)=>s+(x.liked?1:0),0) + 8910 : p._likes;
  $("#pp-following").textContent = fmt(followingN);
  $("#pp-followers").textContent = fmt(followersN);
  $("#pp-likes").textContent = fmt(likesN);

  $("#pp-bio").textContent = isMe
    ? "✨ Selamat datang di TikTok Lite ✨\nSuka nonton, suka berbagi."
    : p.bio;

  renderProfileActions(p);
  renderProfileBody();
}
function renderProfileActions(p){
  const box = $("#pp-actions");
  box.innerHTML = "";
  if (!p) {
    const edit = el("button","edit","Edit profil");
    edit.addEventListener("click", () => toast("Edit profil tidak termasuk versi inti 🚧"));
    box.appendChild(edit);
    return;
  }
  const follow = el("button", p.following ? "following-state" : "follow", p.following ? "Mengikuti" : "Ikuti");
  follow.addEventListener("click", () => {
    setFollowing(p, !p.following);
    toast(p.following ? `Berhasil mengikuti @${p.user}` : `Berhenti mengikuti @${p.user}`);
  });
  const chat = el("button","chat","💬");
  chat.addEventListener("click", () => toast("Pesan langsung tidak termasuk versi inti 🚧"));
  box.append(follow, chat);
}
function renderProfileBody(){
  const grid = $("#pp-grid");
  const empty = $("#pp-empty");
  grid.innerHTML = ""; empty.hidden = true;
  const isMe = profileTarget === "me";

  let items = [];
  if (ppTab === "videos") {
    items = isMe ? [] : [profileTarget];
    if (isMe) {
      empty.hidden = false;
      empty.textContent = "Belum ada video.\nKetuk tombol + untuk membuat video pertamamu (demo).";
    }
  } else {
    items = isMe ? POSTS.filter(x => x.liked) : [];
    if (!items.length) {
      empty.hidden = false;
      empty.textContent = isMe
        ? "Belum ada video yang disukai.\nVideo yang kamu sukai akan muncul di sini."
        : "Video yang disukai akun ini bersifat pribadi.";
    }
  }

  items.forEach(p => {
    const it = el("div","pp-item");
    it.style.background = `linear-gradient(160deg, hsl(${p.hue} 60% 38%), hsl(${(p.hue+60)%360} 65% 25%))`;
    it.innerHTML = `<span class="init">${initials(p.user)}</span>
      <span class="likes">${ICONS.heart}${fmt(p._likes)}</span>`;
    it.addEventListener("click", () => {
      closeProfile();
      const i = POSTS.indexOf(p);
      if (i > -1) feed.children[i].scrollIntoView({ behavior:"smooth" });
    });
    grid.appendChild(it);
  });
}

/* ---------- bottom nav ---------- */
document.querySelectorAll(".navbtn").forEach(b => b.addEventListener("click", () => {
  const nav = b.dataset.nav;
  if (nav === "home") { feed.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (nav === "create") { toast("🎬 Fitur buat video tidak termasuk versi inti"); return; }
  document.querySelectorAll(".navbtn").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  if (nav === "profile") { openProfile("me"); return; }
  toast(`Halaman ${{ friends:"Teman", inbox:"Kotak Masuk" }[nav]} tidak termasuk fitur inti 🚧`);
  setTimeout(() => { b.classList.remove("active"); $(".navbtn[data-nav=home]").classList.add("active"); }, 1400);
}));

/* ---------- keyboard (desktop) ---------- */
document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  if (e.key === "Escape") { closeProfile(); closeSheets(); return; }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const dir = e.key === "ArrowDown" ? 1 : -1;
    const idx = Math.max(0, [...feed.children].indexOf(activeSlide));
    feed.children[Math.min(feed.children.length-1, Math.max(0, idx+dir))]?.scrollIntoView({ behavior:"smooth" });
  }
  if (e.key === " ") { e.preventDefault(); if (activeSlide) togglePlay(activeSlide); }
  if (e.key === "m") $("#btn-mute").click();
});

#!/usr/bin/env node
/* Menghasilkan app/js/data.js dari data/tiktok-reference.json.
   Pemakaian:
     node tools/build-data.js            # tulis app/js/data.js
     node tools/build-data.js --check    # validasi konsistensi (untuk CI), exit 1 bila beda
*/
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "data", "tiktok-reference.json");
const API = path.join(ROOT, "data", "tiktok-api-oembed.json");
const OUT = path.join(ROOT, "app", "js", "data.js");

const json = JSON.parse(fs.readFileSync(SRC, "utf8"));
const apiJson = JSON.parse(fs.readFileSync(API, "utf8"));

// Buang field internal yang tidak dibutuhkan runtime
const data = {
  brand: json.brand,
  ui_strings: json.ui_strings,
  trending: json.trending,
  api_oembed: {
    endpoint: apiJson.meta.endpoint,
    diambil_pada: apiJson.meta.diambil_pada,
    videos: apiJson.videos,
  },
  meta: { diambil_pada: json.meta.diambil_pada, sumber: json.meta.sumber.map(s => s.nama) },
};

const body =
`/* Dibangkitkan OTOMATIS dari data/tiktok-reference.json oleh tools/build-data.js
   JANGAN edit manual — jalankan: node tools/build-data.js
   Sumber data: ${data.meta.sumber.join(" | ")} */
window.TIKTOK_DATA = ${JSON.stringify(data, null, 2)};
`;

if (process.argv[2] === "--check") {
  let current = "";
  try { current = fs.readFileSync(OUT, "utf8"); } catch (e) { current = ""; }
  if (current.trim() !== body.trim()) {
    console.error("❌ app/js/data.js tidak sinkron dengan data/tiktok-reference.json");
    console.error("   Jalankan: node tools/build-data.js");
    process.exit(1);
  }
  console.log("✅ data.js sinkron dengan tiktok-reference.json");
  process.exit(0);
}

fs.writeFileSync(OUT, body);
console.log("✅ app/js/data.js dibuat (" + body.length + " byte)");

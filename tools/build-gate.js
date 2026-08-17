#!/usr/bin/env node
/*
 * Builds the password-gated preview page.
 *
 *   node tools/build-gate.js <access-code> [source.html] [out.html]
 *
 * The mockup is encrypted with AES-256-GCM using a key derived from the
 * access code (PBKDF2-SHA256, 200k iterations), so the published page
 * contains no readable copy of the app — viewing source reveals nothing.
 * The browser decrypts it in place once the correct code is entered.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ITER = 200000;
const code = process.argv[2];
const src = process.argv[3] || path.join(__dirname, "..", "index.html");
const out = process.argv[4] || path.join(__dirname, "..", "gated.html");

if (!code){
  console.error("usage: node tools/build-gate.js <access-code> [source.html] [out.html]");
  process.exit(1);
}

const html = fs.readFileSync(src, "utf8");
if (/__PAYLOAD__/.test(html)){
  console.error("refusing to encrypt the gate page itself — pass the mockup as the source");
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(code.trim().toLowerCase(), salt, ITER, 32, "sha256");
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
const ct = Buffer.concat([cipher.update(html, "utf8"), cipher.final(), cipher.getAuthTag()]);
const payload = Buffer.concat([salt, iv, ct]).toString("base64");

const page = fs.readFileSync(path.join(__dirname, "gate-template.html"), "utf8")
  .replace("__PAYLOAD__", payload);

fs.writeFileSync(out, page);
console.log(`gated page written to ${out}`);
console.log(`  source     ${(html.length/1024).toFixed(1)} KB -> payload ${(payload.length/1024).toFixed(1)} KB`);
console.log(`  access code "${code}" (case-insensitive, spaces trimmed)`);

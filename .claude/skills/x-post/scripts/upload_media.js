#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { typefullyFetch, parseArgs } from './lib.js';

const args = parseArgs(process.argv.slice(2));
const src = args._[0];
if (!src) {
  console.error('Usage: upload_media.js <image_url_or_path>');
  process.exit(2);
}

async function loadSource(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`download failed: ${res.status} ${src}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (new URL(src).pathname.split('.').pop() || 'jpg').toLowerCase();
    const type = res.headers.get('content-type') || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    return { buf, name: `image.${ext}`, type };
  }
  const abs = path.resolve(src);
  const buf = fs.readFileSync(abs);
  const ext = path.extname(abs).slice(1).toLowerCase() || 'jpg';
  return { buf, name: path.basename(abs), type: `image/${ext === 'jpg' ? 'jpeg' : ext}` };
}

const { buf, name, type } = await loadSource(src);
const form = new FormData();
form.append('file', new Blob([buf], { type }), name);

const res = await typefullyFetch('/media/upload', { method: 'POST', body: form });
const id = res?.media_id || res?.id || res?.data?.id;
if (!id) {
  console.error('Unexpected response:', JSON.stringify(res));
  process.exit(1);
}
console.log(id);

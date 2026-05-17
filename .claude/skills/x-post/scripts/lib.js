import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const API_BASE = process.env.TYPEFULLY_API_BASE || 'https://api.typefully.com/v2';

export function loadConfig() {
  if (process.env.TYPEFULLY_API_KEY) {
    return {
      apiKey: process.env.TYPEFULLY_API_KEY,
      socialSetId: process.env.TYPEFULLY_SOCIAL_SET_ID || null,
    };
  }
  const candidates = [
    path.resolve('.typefully/config.json'),
    path.resolve('.claude/skills/x-post/.env.json'),
    path.join(os.homedir(), '.config/typefully/config.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (cfg.apiKey) return cfg;
    }
  }
  throw new Error('TYPEFULLY_API_KEY not found. Set env var or run scripts/setup.sh.');
}

export async function typefullyFetch(pathPart, { method = 'GET', body, headers = {} } = {}) {
  const { apiKey } = loadConfig();
  const url = `${API_BASE}${pathPart}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const err = new Error(`Typefully ${method} ${pathPart} -> ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

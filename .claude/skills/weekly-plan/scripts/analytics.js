#!/usr/bin/env node
import { typefullyFetch, parseArgs } from '../../x-post/scripts/lib.js';

const args = parseArgs(process.argv.slice(2));
const days = Number(args['days'] || 14);

function isoDate(d) { return d.toISOString().slice(0, 10); }
const end = new Date();
const start = new Date(end.getTime() - days * 86400000);
const qs = new URLSearchParams({
  'start-date': args['start-date'] || isoDate(start),
  'end-date': args['end-date'] || isoDate(end),
});
if (args['include-replies']) qs.set('include-replies', 'true');

const data = await typefullyFetch(`/analytics/x/posts?${qs}`);
const posts = Array.isArray(data) ? data : (data.posts || data.data || []);

if (args['json']) {
  console.log(JSON.stringify(posts, null, 2));
} else {
  const scored = posts.map(p => ({
    id: p.id,
    text: (p.text || '').replace(/\n/g, ' ').slice(0, 70),
    impressions: p.impressions ?? p.metrics?.impressions ?? 0,
    likes: p.likes ?? p.metrics?.likes ?? 0,
    replies: p.replies ?? p.metrics?.replies ?? 0,
    reposts: p.reposts ?? p.metrics?.reposts ?? 0,
    bookmarks: p.bookmarks ?? p.metrics?.bookmarks ?? 0,
    published_at: p.published_at || p.created_at || '',
  }));
  scored.sort((a, b) => b.impressions - a.impressions);
  console.log(`\nTop 5 by impressions (${qs.get('start-date')} → ${qs.get('end-date')}):\n`);
  for (const p of scored.slice(0, 5)) {
    console.log(`  imp=${p.impressions}\tlike=${p.likes}\trep=${p.replies}\tbm=${p.bookmarks}\t${p.text}`);
  }
  console.log(`\nBottom 3:\n`);
  for (const p of scored.slice(-3)) {
    console.log(`  imp=${p.impressions}\tlike=${p.likes}\trep=${p.replies}\tbm=${p.bookmarks}\t${p.text}`);
  }
  const total = scored.reduce((s, p) => s + p.impressions, 0);
  console.log(`\n${scored.length} posts, total impressions: ${total}, avg: ${scored.length ? Math.round(total / scored.length) : 0}`);
}

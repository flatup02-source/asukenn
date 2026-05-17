#!/usr/bin/env node
import { typefullyFetch, parseArgs } from '../../x-post/scripts/lib.js';

const args = parseArgs(process.argv.slice(2));

function isoDate(d) { return d.toISOString().slice(0, 10); }
const today = new Date();
const start = args['start-date'] || isoDate(today);
const days = Number(args['days'] || 7);
const endDate = new Date(today.getTime() + days * 86400000);
const end = args['end-date'] || isoDate(endDate);

const qs = new URLSearchParams({ 'start-date': start, 'end-date': end });
const data = await typefullyFetch(`/queue?${qs}`);
const items = Array.isArray(data) ? data : (data.items || data.data || []);

if (args['json']) {
  console.log(JSON.stringify(items, null, 2));
} else {
  const byDay = {};
  for (const it of items) {
    const ts = it.schedule_at || it.scheduled_at || it.publish_at || '';
    const day = ts.slice(0, 10) || 'unscheduled';
    (byDay[day] ||= []).push(it);
  }
  for (const day of Object.keys(byDay).sort()) {
    console.log(`\n== ${day} (${byDay[day].length}) ==`);
    for (const it of byDay[day]) {
      const time = (it.schedule_at || it.scheduled_at || '').slice(11, 16);
      const text = (it.text || it.platforms?.x?.posts?.[0]?.text || '').replace(/\n/g, ' ').slice(0, 70);
      console.log(`  ${time}  ${text}`);
    }
    if (byDay[day].length > 5) {
      console.log(`  ⚠️  ${byDay[day].length} posts on ${day} exceeds the 5/day soft cap.`);
    }
  }
  console.log(`\nTotal: ${items.length} scheduled posts (${start} → ${end}).`);
}

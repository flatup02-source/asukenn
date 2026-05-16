#!/usr/bin/env node
import { typefullyFetch, parseArgs } from '../../x-post/scripts/lib.js';

const args = parseArgs(process.argv.slice(2));
const socialSetId = args['social-set'] || process.env.TYPEFULLY_SOCIAL_SET_ID;
if (!socialSetId) {
  console.error('Set TYPEFULLY_SOCIAL_SET_ID or pass --social-set.');
  process.exit(2);
}

const status = args['status'] || 'draft';
const qs = new URLSearchParams({ status });
if (args['limit']) qs.set('limit', String(args['limit']));

const data = await typefullyFetch(`/social-sets/${socialSetId}/drafts?${qs}`);
const drafts = Array.isArray(data) ? data : (data.drafts || data.data || []);

if (args['json']) {
  console.log(JSON.stringify(drafts, null, 2));
} else {
  for (const d of drafts) {
    const id = d.id || d.draft_id;
    const text = (d.text || d.platforms?.x?.posts?.[0]?.text || '').replace(/\n/g, ' ').slice(0, 80);
    const scheduled = d.schedule_at || d.scheduled_at || '';
    console.log(`${id}\t${scheduled ? '[' + scheduled + ']' : '[draft]'}\t${text}`);
  }
  console.log(`\n${drafts.length} drafts.`);
}

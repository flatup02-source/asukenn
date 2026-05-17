#!/usr/bin/env node
import fs from 'node:fs';
import { typefullyFetch, parseArgs, loadConfig } from './lib.js';

const args = parseArgs(process.argv.slice(2));

const postsJson = args['posts-json'];
const inlineText = args['text'];
if (!postsJson && !inlineText) {
  console.error('Usage: create_draft.js (--posts-json <file> | --text "...") [--media-ids id1,id2] [--schedule ISO] [--platforms x,linkedin] [--publish]');
  process.exit(2);
}

let posts;
if (postsJson) {
  const raw = JSON.parse(fs.readFileSync(postsJson, 'utf8'));
  posts = Array.isArray(raw) ? raw : raw.posts;
} else {
  posts = [{ text: inlineText }];
}

const mediaIds = args['media-ids']
  ? String(args['media-ids']).split(',').map(s => s.trim()).filter(Boolean)
  : [];
if (mediaIds.length && posts.length) {
  posts[0].media_ids = [...(posts[0].media_ids || []), ...mediaIds];
}

const platforms = (args['platforms'] || 'x').split(',').map(s => s.trim()).filter(Boolean);
const platformsBody = {};
for (const p of platforms) {
  platformsBody[p] = { enabled: true, posts };
}

const body = { platforms: platformsBody };
if (args['schedule']) body.schedule_at = args['schedule'];

const { socialSetId: cfgId } = loadConfig();
const socialSetId = args['social-set'] || process.env.TYPEFULLY_SOCIAL_SET_ID || cfgId;
if (!socialSetId) {
  console.error('No social set id. Set TYPEFULLY_SOCIAL_SET_ID or pass --social-set.');
  process.exit(2);
}

const draft = await typefullyFetch(`/social-sets/${socialSetId}/drafts`, { method: 'POST', body });

if (args['publish']) {
  const draftId = draft?.id || draft?.draft?.id;
  if (!draftId) {
    console.error('Created but missing draft id; skipping publish.');
  } else {
    await typefullyFetch(`/drafts/${draftId}/publish`, { method: 'POST' });
  }
}

console.log(JSON.stringify(draft, null, 2));

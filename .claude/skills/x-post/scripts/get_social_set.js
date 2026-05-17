#!/usr/bin/env node
import { typefullyFetch, parseArgs } from './lib.js';

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] || 'list';

if (cmd === 'list') {
  const sets = await typefullyFetch('/social-sets');
  console.log(JSON.stringify(sets, null, 2));
} else if (cmd === 'me') {
  const me = await typefullyFetch('/me');
  console.log(JSON.stringify(me, null, 2));
} else {
  console.error(`Unknown subcommand: ${cmd}. Use "list" or "me".`);
  process.exit(2);
}

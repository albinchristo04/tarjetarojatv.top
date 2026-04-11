import test from 'node:test';
import assert from 'node:assert/strict';
import { getSiteData } from '../src/lib/data';
import { buildShareEntry, buildShareText, formatShareTime } from '../src/lib/share';

test('share time is formatted in 12-hour clock', () => {
  assert.equal(formatShareTime('21:00'), '09:00 PM');
  assert.equal(formatShareTime('00:15'), '12:15 AM');
});

test('share entries include server-specific match links', () => {
  const match = getSiteData(true).matches[0];
  const entry = buildShareEntry(match);

  assert.equal(entry.links.length, 4);
  assert.equal(entry.links[0], `https://tarjetarojatv.top/partido/${match.slug}/?s=1`);
  assert.equal(entry.links[1], `https://tarjetarojatv.top/partido/${match.slug}/?s=2`);
});

test('share text groups matches under league headers and trims extra servers', () => {
  const match = getSiteData(true).matches[0];
  const entry = buildShareEntry(match);
  const output = buildShareText([entry], {
    serverCount: 2,
    includeDateHeadings: false,
  });

  assert.match(output, /LIVE Link/);
  assert.match(output, new RegExp(entry.homeTeam));
  assert.match(output, new RegExp(entry.awayTeam));
  assert.match(output, new RegExp(`\\?s=1`));
  assert.match(output, new RegExp(`\\?s=2`));
  assert.doesNotMatch(output, /\?s=3/);
  assert.ok(output.startsWith(entry.leagueHeader));
});

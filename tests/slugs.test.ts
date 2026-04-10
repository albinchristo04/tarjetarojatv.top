import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUniqueMatchSlugs, leagueSlug, teamSlug } from '../src/lib/slugs';

test('league slugs honor explicit mappings', () => {
  assert.equal(leagueSlug('Ligue Des Champions'), 'champions-league');
  assert.equal(leagueSlug('Concacaf Champions Cup'), 'concacaf');
});

test('team slugs normalize abbreviations and punctuation', () => {
  assert.equal(teamSlug('Atl. Madrid'), 'atletico-madrid');
  assert.equal(teamSlug('U. Catolica'), 'universidad-catolica');
  assert.equal(teamSlug('St.Louis Cardinals'), 'st-louis-cardinals');
});

test('duplicate match slugs get a deterministic suffix', () => {
  const slugs = buildUniqueMatchSlugs([
    { homeTeam: 'Barcelona', awayTeam: 'Real Madrid', date: '08-04-2026' },
    { homeTeam: 'Barcelona', awayTeam: 'Real Madrid', date: '09-04-2026' },
  ]);

  assert.equal(slugs[0], 'barcelona-vs-real-madrid');
  assert.equal(slugs[1], 'barcelona-vs-real-madrid-09-04-2026');
});


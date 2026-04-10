import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMatchFaq } from '../src/lib/faq';

test('match FAQ contains three core search-intent entries', () => {
  const faq = buildMatchFaq({
    homeTeam: 'New York Yankees',
    awayTeam: 'Athletics',
    leagueDisplayName: 'MLB',
    time: '01:05',
    channelCount: 2,
    timezoneRow: '01:05 Madrid · 18:05 CDMX',
  });

  assert.equal(faq.length, 3);
  assert.match(faq[0].question, /Donde mirar/);
  assert.match(faq[1].answer, /MLB/);
  assert.match(faq[2].answer, /cuatro servidores/);
});


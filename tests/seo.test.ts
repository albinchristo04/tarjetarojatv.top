import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCanonical, buildFaqSchema, buildMatchMetaDescription } from '../src/lib/seo';

test('canonical URLs always end with a trailing slash', () => {
  assert.equal(buildCanonical('/partido/foo'), 'https://tarjetarojatv.top/partido/foo/');
});

test('faq schema is emitted as FAQPage', () => {
  const schema = buildFaqSchema([{ question: 'Q', answer: 'A' }]);
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity.length, 1);
});

test('match descriptions include the teams and brand', () => {
  const description = buildMatchMetaDescription({
    homeTeam: 'Barcelona',
    awayTeam: 'Atletico Madrid',
    leagueDisplayName: 'Champions League',
    channelCount: 4,
  } as never);

  assert.match(description, /Barcelona/);
  assert.match(description, /Atletico Madrid/);
  assert.match(description, /Tarjeta Roja TV/);
});


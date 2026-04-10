import test from 'node:test';
import assert from 'node:assert/strict';
import { RESERVED_ROOT_SLUGS } from '../src/lib/config';
import { getRenderableLeagueGroups, getSiteData } from '../src/lib/data';

test('fallback site data contains matches and team pages', () => {
  const siteData = getSiteData(true);
  assert.ok(siteData.matchCount > 0);
  assert.ok(siteData.teams.length > 0);
});

test('league groups rendered at root never collide with reserved slugs', () => {
  const groups = getRenderableLeagueGroups();
  groups.forEach((group) => {
    assert.equal(RESERVED_ROOT_SLUGS.has(group.slug), false);
  });
});

test('normalized channels expose four server variants', () => {
  const siteData = getSiteData(true);
  const firstMatch = siteData.matches.find((match) => match.channels.length > 0);
  assert.ok(firstMatch);
  firstMatch?.channels.forEach((channel) => {
    assert.equal(channel.servers.length, 4);
  });
});

test('baseball hubs are populated from MLB data', () => {
  const siteData = getSiteData(true);
  assert.ok(siteData.sports.beisbol.matches.length > 0);
  assert.ok(siteData.sports.mlb.matches.length > 0);
});

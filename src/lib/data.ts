import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  LANGUAGE_LABELS,
  LEAGUE_PRIORITY,
  PLAYER_BASE_URL,
  RESERVED_ROOT_SLUGS,
  SERVER_OPTIONS,
  SITE_NAME,
  SPORT_DEFINITIONS,
} from './config';
import { buildHubFaq, buildMatchFaq } from './faq';
import { buildUniqueMatchSlugs, leagueSlug, normalizeLeagueName, splitTeams, teamSlug } from './slugs';
import {
  buildTimezoneRow,
  formatSpanishDate,
  getTimezoneDisplay,
  toIsoDate,
  zonedDateTimeToUtc,
} from './timezones';
import type {
  LeagueGroup,
  NormalizedChannel,
  NormalizedMatch,
  RawChannel,
  RawDataset,
  RawEvent,
  SiteData,
  SportHub,
  TeamGroup,
} from './types';

const fallbackPath = resolve(process.cwd(), 'src/data/rereyano_data.fallback.json');
const currentPath = resolve(process.cwd(), 'src/data/rereyano_data.current.json');

let cachedSiteData: SiteData | null = null;

function readJsonFile(pathname: string): RawDataset {
  return JSON.parse(readFileSync(pathname, 'utf8')) as RawDataset;
}

function detectSportKey(league: string): string {
  if (/mlb|baseball|beisbol/i.test(league)) return 'mlb';
  if (/nba|baloncesto|basket/i.test(league)) return 'nba';
  if (/nhl|hockey/i.test(league)) return 'nhl';
  if (/motogp/i.test(league)) return 'motogp';
  return 'futbol';
}

function getSportLabel(key: string): string {
  switch (key) {
    case 'mlb':
      return 'MLB';
    case 'nba':
      return 'NBA';
    case 'nhl':
      return 'NHL';
    case 'motogp':
      return 'MotoGP';
    default:
      return 'Futbol';
  }
}

function normalizeChannel(rawChannel: RawChannel): NormalizedChannel {
  const channelId = String(rawChannel?.id || '').trim();
  const langCode = (rawChannel?.lang || 'es').trim().toLowerCase();
  const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

  return {
    id: `${channelId}-${langCode}`,
    channelId,
    langCode,
    langLabel,
    displayName: `CH${channelId} ${langLabel}`,
    servers: SERVER_OPTIONS.map((server) => ({
      id: server.id,
      label: server.label,
      url: `${PLAYER_BASE_URL}/${server.id}/${channelId}`,
    })),
  };
}

function normalizeEvents(rawEvents: RawEvent[]): NormalizedMatch[] {
  const parsedTeams = rawEvents.map((event) => splitTeams(event.teams || 'Equipo 1 - Equipo 2'));
  const slugs = buildUniqueMatchSlugs(
    parsedTeams.map(([homeTeam, awayTeam], index) => ({
      homeTeam,
      awayTeam,
      date: rawEvents[index]?.date || '',
    }))
  );

  return rawEvents.map((event, index) => {
    const [homeTeam, awayTeam] = parsedTeams[index];
    const leagueName = normalizeLeagueName(event.league || 'Liga');
    const leagueKey = event.league || leagueName;
    const sportKey = detectSportKey(leagueName);
    const sportSlug = SPORT_DEFINITIONS[sportKey as keyof typeof SPORT_DEFINITIONS]?.slug || 'futbol';
    const channels = (event.channels || []).map(normalizeChannel);
    const availableLanguages = [...new Set(channels.map((channel) => channel.langLabel))];
    const isoDate = toIsoDate(event.date || '');
    const isoDateTime = zonedDateTimeToUtc(event.date || '', event.time || '00:00').toISOString();

    const match: NormalizedMatch = {
      id: index + 1,
      slug: slugs[index],
      date: event.date || '',
      time: event.time || '',
      datetime: event.datetime || `${event.date || ''} ${event.time || ''}`.trim(),
      isoDate,
      isoDateTime,
      league: leagueKey,
      leagueDisplayName: leagueName,
      leagueSlug: leagueSlug(leagueKey),
      sportKey,
      sportLabel: getSportLabel(sportKey),
      sportSlug,
      teams: `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      homeTeamSlug: teamSlug(homeTeam),
      awayTeamSlug: teamSlug(awayTeam),
      channels,
      channelCount: channels.length,
      availableLanguages,
      languageSummary: availableLanguages.join(', '),
      timezoneRow: buildTimezoneRow(event.date || '', event.time || '00:00'),
      timezones: getTimezoneDisplay(event.date || '', event.time || '00:00'),
      eventDateLabel: formatSpanishDate(event.date || ''),
      isMlb: leagueName === 'MLB',
      faq: [],
    };

    match.faq = buildMatchFaq(match);
    return match;
  });
}

function sortMatches(matches: NormalizedMatch[]): NormalizedMatch[] {
  return [...matches].sort((left, right) => {
    const dateCompare = left.isoDateTime.localeCompare(right.isoDateTime);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    return left.slug.localeCompare(right.slug);
  });
}

function buildLeagueGroups(matches: NormalizedMatch[]): LeagueGroup[] {
  const grouped = new Map<string, LeagueGroup>();

  for (const match of matches) {
    const existing = grouped.get(match.leagueSlug);
    if (existing) {
      existing.matches.push(match);
      continue;
    }

    grouped.set(match.leagueSlug, {
      name: match.league,
      displayName: match.leagueDisplayName,
      slug: match.leagueSlug,
      sportKey: match.sportKey,
      sportSlug: match.sportSlug,
      matches: [match],
      priority: LEAGUE_PRIORITY[match.league] || 10,
    });
  }

  return [...grouped.values()]
    .map((group) => ({
      ...group,
      matches: sortMatches(group.matches),
    }))
    .sort((left, right) => {
      const priorityCompare = right.priority - left.priority;
      if (priorityCompare !== 0) {
        return priorityCompare;
      }
      return left.displayName.localeCompare(right.displayName);
    });
}

function buildTeamGroups(matches: NormalizedMatch[]): TeamGroup[] {
  const grouped = new Map<string, TeamGroup>();

  for (const match of matches) {
    for (const teamName of [match.homeTeam, match.awayTeam]) {
      const slug = teamSlug(teamName);
      const existing = grouped.get(slug);
      if (existing) {
        existing.matches.push(match);
        continue;
      }
      grouped.set(slug, {
        name: teamName,
        slug,
        matches: [match],
      });
    }
  }

  return [...grouped.values()]
    .map((group) => ({
      ...group,
      matches: sortMatches(group.matches),
    }))
    .sort((left, right) => right.matches.length - left.matches.length || left.name.localeCompare(right.name));
}

function buildSportHub(key: keyof typeof SPORT_DEFINITIONS, matches: NormalizedMatch[], leagues: LeagueGroup[]): SportHub {
  const definition = SPORT_DEFINITIONS[key];
  const hubMatches =
    key === 'beisbol'
      ? matches.filter((match) => match.sportKey === 'mlb')
      : matches.filter((match) => match.sportKey === key);
  const leagueGroups =
    key === 'beisbol'
      ? leagues.filter((group) => group.sportKey === 'mlb')
      : leagues.filter((group) => group.sportKey === key);

  return {
    key: definition.key,
    slug: definition.slug,
    label: definition.label,
    title: definition.title,
    matches: hubMatches,
    leagueGroups,
  };
}

function loadRawDataset(preferFallback = false): { source: 'current' | 'fallback'; data: RawDataset } {
  if (!preferFallback && existsSync(currentPath)) {
    const current = readJsonFile(currentPath);
    if ((current.events || []).length > 0) {
      return { source: 'current', data: current };
    }
  }

  return {
    source: 'fallback',
    data: readJsonFile(fallbackPath),
  };
}

export function getSiteData(preferFallback = false): SiteData {
  if (!preferFallback && cachedSiteData) {
    return cachedSiteData;
  }

  const loaded = loadRawDataset(preferFallback || process.env.USE_FALLBACK_DATA === '1');
  const matches = sortMatches(normalizeEvents(loaded.data.events || []));
  const leagues = buildLeagueGroups(matches);
  const teams = buildTeamGroups(matches);

  const siteData: SiteData = {
    source: loaded.source,
    lastUpdated: loaded.data.last_updated || new Date().toISOString(),
    matchCount: matches.length,
    matches,
    leagues,
    teams,
    sports: {
      futbol: buildSportHub('futbol', matches, leagues),
      beisbol: buildSportHub('beisbol', matches, leagues),
      mlb: buildSportHub('mlb', matches, leagues),
      nba: buildSportHub('nba', matches, leagues),
      nhl: buildSportHub('nhl', matches, leagues),
      motogp: buildSportHub('motogp', matches, leagues),
    },
  };

  if (!preferFallback) {
    cachedSiteData = siteData;
  }

  return siteData;
}

export function getMatchBySlug(slug: string): NormalizedMatch | undefined {
  return getSiteData().matches.find((match) => match.slug === slug);
}

export function getLeagueBySlug(slug: string): LeagueGroup | undefined {
  if (RESERVED_ROOT_SLUGS.has(slug)) {
    return undefined;
  }
  return getSiteData().leagues.find((league) => league.slug === slug);
}

export function getTeamBySlug(slug: string): TeamGroup | undefined {
  return getSiteData().teams.find((team) => team.slug === slug);
}

export function getRenderableLeagueGroups(): LeagueGroup[] {
  return getSiteData().leagues.filter((league) => !RESERVED_ROOT_SLUGS.has(league.slug));
}

export function getBrandFaq(brand: string, matches: NormalizedMatch[]) {
  return buildHubFaq(brand, matches);
}

export function getSiteSummary() {
  const siteData = getSiteData();
  const topLeague = siteData.leagues[0]?.displayName || 'deportes';
  return `${SITE_NAME} actualiza ${siteData.matchCount} partidos con foco en ${topLeague}.`;
}

import { LEAGUE_DISPLAY_NAME_MAP, LEAGUE_SLUG_MAP } from './config';

const TEAM_REPLACEMENTS: Record<string, string> = {
  'Atl.': 'Atletico',
  'Atl ': 'Atletico ',
  'U. ': 'Universidad ',
  'St.Louis': 'St Louis',
  'St.': 'Saint',
};

export function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function cleanWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function slugifySegment(value: string): string {
  return cleanWhitespace(stripDiacritics(value))
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function normalizeLeagueName(league: string): string {
  return LEAGUE_DISPLAY_NAME_MAP[league] || cleanWhitespace(league);
}

export function leagueSlug(league: string): string {
  return LEAGUE_SLUG_MAP[league] || slugifySegment(normalizeLeagueName(league));
}

export function normalizeTeamName(team: string): string {
  let next = cleanWhitespace(team);
  for (const [needle, replacement] of Object.entries(TEAM_REPLACEMENTS)) {
    next = next.replaceAll(needle, replacement);
  }
  return cleanWhitespace(next);
}

export function teamSlug(team: string): string {
  return slugifySegment(normalizeTeamName(team));
}

export function splitTeams(teams: string): [string, string] {
  const cleaned = cleanWhitespace(teams);
  const parts = cleaned.includes(' - ')
    ? cleaned.split(/\s+-\s+/)
    : cleaned.split(/\s+vs\.?\s+/i);
  return [
    normalizeTeamName(parts[0] || 'Equipo 1'),
    normalizeTeamName(parts[1] || 'Equipo 2'),
  ];
}

export function buildMatchBaseSlug(homeTeam: string, awayTeam: string): string {
  return `${teamSlug(homeTeam)}-vs-${teamSlug(awayTeam)}`;
}

export function buildUniqueMatchSlugs(
  pairs: Array<{ homeTeam: string; awayTeam: string; date: string }>
): string[] {
  const seen = new Map<string, number>();
  return pairs.map(({ homeTeam, awayTeam, date }) => {
    const base = buildMatchBaseSlug(homeTeam, awayTeam);
    const nextCount = (seen.get(base) || 0) + 1;
    seen.set(base, nextCount);
    if (nextCount === 1) {
      return base;
    }
    return `${base}-${slugifySegment(date)}`;
  });
}

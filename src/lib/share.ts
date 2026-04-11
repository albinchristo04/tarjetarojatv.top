import { SITE_URL } from './config';
import { formatSpanishDate } from './timezones';
import type { NormalizedMatch } from './types';

export interface ShareEntry {
  id: string;
  slug: string;
  date: string;
  dateLabel: string;
  leagueKey: string;
  leagueTitle: string;
  leagueBadge: string;
  leagueHeader: string;
  homeTeam: string;
  awayTeam: string;
  timeLabel: string;
  links: string[];
}

const LEAGUE_SHARE_META: Record<string, { title: string; badge: string }> = {
  'Champions League': { title: 'UCL', badge: '🇪🇺 UCL' },
  'Copa Libertadores': { title: 'Copa Libertadores', badge: '🌎 CONMEBOL' },
  'Copa Sudamericana': { title: 'Copa Sudamericana', badge: '🌎 CONMEBOL' },
  'Liga MX': { title: 'Liga MX', badge: '🇲🇽 MEX' },
  'La Liga': { title: 'La Liga', badge: '🇪🇸 ESP' },
  Laliga: { title: 'La Liga', badge: '🇪🇸 ESP' },
  'Copa Argentina': { title: 'Copa Argentina', badge: '🇦🇷 ARG' },
  'Ecuador Ligapro': { title: 'LigaPro Ecuador', badge: '🇪🇨 ECU' },
  'Concacaf Champions Cup': { title: 'Concacaf Champions Cup', badge: '🌎 CONCACAF' },
  MLB: { title: 'MLB', badge: '🇺🇸 USA' },
  NBA: { title: 'NBA', badge: '🇺🇸 USA' },
  NHL: { title: 'NHL', badge: '🇺🇸 USA' },
  MotoGP: { title: 'MotoGP', badge: '🏁 MOTO' },
};

export function formatShareTime(time: string): string {
  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText || 0);
  const minute = Number(minuteText || 0);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function getLeagueShareMeta(leagueName: string, sportKey: string) {
  if (LEAGUE_SHARE_META[leagueName]) {
    return LEAGUE_SHARE_META[leagueName];
  }

  if (sportKey === 'futbol') {
    return { title: leagueName, badge: '⚽ FUT' };
  }

  if (sportKey === 'mlb' || sportKey === 'nba' || sportKey === 'nhl') {
    return { title: leagueName, badge: '🇺🇸 USA' };
  }

  return { title: leagueName, badge: '📺 LIVE' };
}

export function buildShareLinks(match: Pick<NormalizedMatch, 'slug'>, count = 2): string[] {
  return Array.from({ length: count }, (_, index) => `${SITE_URL}/partido/${match.slug}/?s=${index + 1}`);
}

export function buildShareEntry(match: NormalizedMatch): ShareEntry {
  const meta = getLeagueShareMeta(match.leagueDisplayName, match.sportKey);

  return {
    id: match.slug,
    slug: match.slug,
    date: match.date,
    dateLabel: formatSpanishDate(match.date),
    leagueKey: match.leagueSlug,
    leagueTitle: meta.title,
    leagueBadge: meta.badge,
    leagueHeader: `🏆 ${meta.title} ⚽️🔥`,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    timeLabel: formatShareTime(match.time),
    links: buildShareLinks(match, 4),
  };
}

function formatMatchBlock(entry: ShareEntry, serverCount: number) {
  const linkLines = entry.links.slice(0, serverCount).map((link) => `🔗 ${link}`);

  return [
    `Ⓜ️ ${entry.homeTeam} 🆚 ${entry.awayTeam}`,
    `${entry.leagueBadge} | ${entry.timeLabel}`,
    '📱 LIVE Link',
    ...linkLines,
  ].join('\n');
}

export function buildShareText(
  entries: ShareEntry[],
  options?: { serverCount?: number; includeDateHeadings?: boolean }
) {
  if (entries.length === 0) {
    return '';
  }

  const serverCount = Math.min(Math.max(options?.serverCount ?? 2, 1), 4);
  const includeDateHeadings = options?.includeDateHeadings ?? true;

  const byDate = new Map<string, Map<string, ShareEntry[]>>();
  const dateLabels = new Map<string, string>();
  const leagueHeaders = new Map<string, string>();

  for (const entry of entries) {
    if (!byDate.has(entry.date)) {
      byDate.set(entry.date, new Map());
      dateLabels.set(entry.date, entry.dateLabel);
    }

    const dateGroup = byDate.get(entry.date)!;
    if (!dateGroup.has(entry.leagueKey)) {
      dateGroup.set(entry.leagueKey, []);
      leagueHeaders.set(entry.leagueKey, entry.leagueHeader);
    }

    dateGroup.get(entry.leagueKey)!.push(entry);
  }

  const lines: string[] = [];
  const multiDate = byDate.size > 1;

  for (const [date, leagues] of byDate.entries()) {
    if (includeDateHeadings && multiDate) {
      lines.push(`📅 ${dateLabels.get(date)}`);
      lines.push('');
    }

    for (const [leagueKey, matches] of leagues.entries()) {
      lines.push(leagueHeaders.get(leagueKey)!);
      lines.push('');

      for (const match of matches) {
        lines.push(formatMatchBlock(match, serverCount));
        lines.push('');
      }
    }
  }

  return lines.join('\n').trim();
}

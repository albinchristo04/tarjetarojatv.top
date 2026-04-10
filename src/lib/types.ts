export interface RawChannel {
  id: string;
  lang?: string;
}

export interface RawEvent {
  date?: string;
  time?: string;
  datetime?: string;
  league?: string;
  teams?: string;
  channels?: RawChannel[];
  raw_line?: string;
}

export interface RawPlayerStream {
  name?: string;
  player_url?: string | null;
  iframe_url?: string | null;
  m3u8_url?: string | null;
  status?: string;
  extracted_at?: string;
}

export interface RawDataset {
  extractor?: string;
  website?: string;
  last_updated?: string;
  total_events?: number;
  total_players?: number;
  m3u8_extracted?: number;
  accessible_streams?: number;
  events?: RawEvent[];
  player_streams?: Record<string, RawPlayerStream>;
  player_urls?: Record<string, string>;
}

export interface ServerOption {
  id: number;
  label: string;
  url: string;
}

export interface NormalizedChannel {
  id: string;
  channelId: string;
  langCode: string;
  langLabel: string;
  displayName: string;
  servers: ServerOption[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface TimezoneDisplay {
  key: string;
  label: string;
  zone: string;
  value: string;
}

export interface NormalizedMatch {
  id: number;
  slug: string;
  date: string;
  time: string;
  datetime: string;
  isoDate: string;
  isoDateTime: string;
  league: string;
  leagueDisplayName: string;
  leagueSlug: string;
  sportKey: string;
  sportLabel: string;
  sportSlug: string;
  teams: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamSlug: string;
  awayTeamSlug: string;
  channels: NormalizedChannel[];
  channelCount: number;
  availableLanguages: string[];
  languageSummary: string;
  timezoneRow: string;
  timezones: TimezoneDisplay[];
  eventDateLabel: string;
  isMlb: boolean;
  faq: FaqEntry[];
}

export interface LeagueGroup {
  name: string;
  displayName: string;
  slug: string;
  sportKey: string;
  sportSlug: string;
  matches: NormalizedMatch[];
  priority: number;
}

export interface TeamGroup {
  name: string;
  slug: string;
  matches: NormalizedMatch[];
}

export interface SportHub {
  key: string;
  slug: string;
  label: string;
  title: string;
  matches: NormalizedMatch[];
  leagueGroups: LeagueGroup[];
}

export interface SiteData {
  source: 'current' | 'fallback';
  lastUpdated: string;
  matchCount: number;
  matches: NormalizedMatch[];
  leagues: LeagueGroup[];
  teams: TeamGroup[];
  sports: Record<string, SportHub>;
}


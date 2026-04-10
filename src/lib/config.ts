export const SITE_URL = 'https://tarjetarojatv.top';
export const SITE_NAME = 'Tarjeta Roja TV';
export const SITE_TAGLINE = 'Tarjeta Roja TV · Roja Directa · Pirlo TV';
export const ENTITY_ALTERNATE_NAMES = [
  'Tarjeta Roja TV',
  'Tarjeta Roja',
  'Roja Directa',
  'Pirlo TV',
  'Tarjeta Roja en Vivo',
];
export const DATA_URL =
  'https://raw.githubusercontent.com/albinchristo04/arda/refs/heads/main/rereyano_data.json';
export const PLAYER_BASE_URL = 'https://bolaloca.my/player';
export const REBUILD_INTERVAL_HOURS = 3;
export const SOURCE_TIMEZONE = 'Europe/Madrid';
export const INDEXNOW_PATH = '/indexnow-key.txt';
export const RESERVED_ROOT_SLUGS = new Set([
  'futbol',
  'beisbol',
  'mlb',
  'nba',
  'nhl',
  'motogp',
  'tarjeta-roja',
  'pirlo-tv',
  'roja-directa-pirlo-tv',
  'tarjeta-roja-pirlo-tv',
  'feed.xml',
  'robots.txt',
  'sitemap.xml',
  'manifest.json',
  'indexnow-key.txt',
]);

export const SERVER_OPTIONS = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
  { id: 4, label: '4' },
] as const;

export const TIMEZONE_OPTIONS = [
  { key: 'madrid', label: 'Madrid', zone: 'Europe/Madrid' },
  { key: 'cdmx', label: 'CDMX', zone: 'America/Mexico_City' },
  { key: 'bogota', label: 'Bogota', zone: 'America/Bogota' },
  { key: 'buenos-aires', label: 'Buenos Aires', zone: 'America/Argentina/Buenos_Aires' },
  { key: 'paris', label: 'Paris', zone: 'Europe/Paris' },
] as const;

export const SPORT_DEFINITIONS = {
  futbol: {
    key: 'futbol',
    slug: 'futbol',
    label: 'Futbol',
    title: 'Futbol en Vivo Hoy',
  },
  beisbol: {
    key: 'beisbol',
    slug: 'beisbol',
    label: 'Beisbol',
    title: 'Beisbol en Vivo Hoy',
  },
  mlb: {
    key: 'mlb',
    slug: 'mlb',
    label: 'MLB',
    title: 'MLB en Vivo Hoy',
  },
  nba: {
    key: 'nba',
    slug: 'nba',
    label: 'NBA',
    title: 'NBA en Vivo Hoy',
  },
  nhl: {
    key: 'nhl',
    slug: 'nhl',
    label: 'NHL',
    title: 'NHL en Vivo Hoy',
  },
  motogp: {
    key: 'motogp',
    slug: 'motogp',
    label: 'MotoGP',
    title: 'MotoGP en Vivo Hoy',
  },
} as const;

export const LEAGUE_SLUG_MAP: Record<string, string> = {
  'Ligue Des Champions': 'champions-league',
  'Champions League': 'champions-league',
  'Copa Libertadores': 'copa-libertadores',
  'Copa Sudamericana': 'copa-sudamericana',
  'Liga MX': 'liga-mx',
  'La Liga': 'laliga',
  Laliga: 'laliga',
  'Copa Argentina': 'copa-argentina',
  'Ecuador Ligapro': 'liga-ecuador',
  'Concacaf Champions Cup': 'concacaf',
  MLB: 'mlb',
  NBA: 'nba',
  NHL: 'nhl',
  MotoGP: 'motogp',
};

export const LEAGUE_DISPLAY_NAME_MAP: Record<string, string> = {
  'Ligue Des Champions': 'Champions League',
};

export const LEAGUE_PRIORITY: Record<string, number> = {
  MLB: 100,
  'Liga MX': 95,
  'La Liga': 94,
  'Ligue Des Champions': 90,
  'Champions League': 90,
  'Copa Libertadores': 89,
  'Copa Sudamericana': 88,
  NBA: 80,
  NHL: 70,
  MotoGP: 65,
  'Concacaf Champions Cup': 60,
  'Copa Argentina': 55,
  'Ecuador Ligapro': 50,
};

export const LANGUAGE_LABELS: Record<string, string> = {
  es: 'Espanol',
  gb: 'Ingles',
  fr: 'Frances',
  it: 'Italiano',
  de: 'Aleman',
  us: 'Ingles (US)',
  pt: 'Portugues',
};


import {
  ENTITY_ALTERNATE_NAMES,
  INDEXNOW_PATH,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from './config';
import type { FaqEntry, LeagueGroup, NormalizedMatch } from './types';

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function buildCanonical(pathname: string): string {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return absoluteUrl(normalized.startsWith('/') ? normalized : `/${normalized}`);
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    alternateName: ENTITY_ALTERNATE_NAMES,
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    alternateName: ENTITY_ALTERNATE_NAMES,
    description: `${SITE_NAME} ofrece partidos y deportes en vivo hoy.`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildItemListSchema(name: string, matches: NormalizedMatch[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: matches.length,
    itemListElement: matches.map((match, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: buildCanonical(`/partido/${match.slug}`),
      name: `${match.homeTeam} vs ${match.awayTeam}`,
    })),
  };
}

export function buildFaqSchema(items: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildSportsEventSchema(match: NormalizedMatch) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.homeTeam} vs ${match.awayTeam}`,
    startDate: match.isoDateTime,
    location: {
      '@type': 'VirtualLocation',
      url: buildCanonical(`/partido/${match.slug}`),
    },
    organizer: {
      '@type': 'SportsOrganization',
      name: match.leagueDisplayName,
    },
    competitor: [
      {
        '@type': 'SportsTeam',
        name: match.homeTeam,
      },
      {
        '@type': 'SportsTeam',
        name: match.awayTeam,
      },
    ],
  };
}

export function buildPageTitle(title: string): string {
  return `${title} | ${SITE_TAGLINE}`;
}

export function buildHomeMetaDescription(matchCount: number): string {
  return `Ver deportes en vivo gratis hoy. ${SITE_NAME} reune futbol, MLB, NBA y mas con ${matchCount} partidos, canales y servidores disponibles.`;
}

export function buildMatchMetaDescription(match: NormalizedMatch): string {
  return `Ver ${match.homeTeam} vs ${match.awayTeam} en vivo hoy por ${match.leagueDisplayName}. ${match.channelCount} canales disponibles en ${SITE_NAME}.`;
}

export function buildLeagueMetaDescription(group: LeagueGroup): string {
  return `Ver ${group.displayName} en vivo hoy. ${group.matches.length} partidos disponibles en ${SITE_NAME} con horarios, canales y multiples servidores.`;
}

export function buildRobotsContent() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

export function buildManifest() {
  return {
    name: SITE_NAME,
    short_name: 'Tarjeta Roja',
    description: `${SITE_TAGLINE} - ver deportes en vivo gratis`,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#d90429',
    lang: 'es',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

export function buildIndexNowUrl() {
  return `${SITE_URL}${INDEXNOW_PATH}`;
}


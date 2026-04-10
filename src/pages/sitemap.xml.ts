import { getRenderableLeagueGroups, getSiteData } from '../lib/data';
import { buildCanonical } from '../lib/seo';

function urlEntry(loc: string, changefreq: string, priority: string) {
  return `<url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export function GET() {
  const siteData = getSiteData();
  const fixedRoutes = [
    { path: '/', changefreq: 'hourly', priority: '1.0' },
    { path: '/futbol', changefreq: 'daily', priority: '0.8' },
    { path: '/beisbol', changefreq: 'daily', priority: '0.8' },
    { path: '/mlb', changefreq: 'daily', priority: '0.9' },
    { path: '/nba', changefreq: 'daily', priority: '0.8' },
    { path: '/nhl', changefreq: 'daily', priority: '0.7' },
    { path: '/motogp', changefreq: 'daily', priority: '0.6' },
    { path: '/tarjeta-roja', changefreq: 'daily', priority: '0.9' },
    { path: '/pirlo-tv', changefreq: 'daily', priority: '0.9' },
    { path: '/roja-directa-pirlo-tv', changefreq: 'daily', priority: '0.85' },
    { path: '/tarjeta-roja-pirlo-tv', changefreq: 'daily', priority: '0.85' },
  ];

  const urls = [
    ...fixedRoutes.map((route) => urlEntry(buildCanonical(route.path), route.changefreq, route.priority)),
    ...getRenderableLeagueGroups().map((group) =>
      urlEntry(buildCanonical(`/${group.slug}`), 'daily', '0.8')
    ),
    ...siteData.teams.map((team) => urlEntry(buildCanonical(`/equipo/${team.slug}`), 'daily', '0.5')),
    ...siteData.matches.flatMap((match) => [
      urlEntry(buildCanonical(`/partido/${match.slug}`), 'hourly', '0.6'),
      urlEntry(buildCanonical(`/ver/${match.slug}`), 'hourly', '0.4'),
      urlEntry(buildCanonical(`/en-vivo/${match.slug}`), 'hourly', '0.4'),
    ]),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

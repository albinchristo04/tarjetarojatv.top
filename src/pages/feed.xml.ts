import { SITE_URL } from '../lib/config';
import { getSiteData } from '../lib/data';
import { buildCanonical } from '../lib/seo';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function GET() {
  const siteData = getSiteData();
  const items = siteData.matches.slice(0, 30);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tarjeta Roja TV - Partidos en vivo</title>
    <link>${SITE_URL}</link>
    <description>Partidos y deportes en vivo hoy</description>
    ${items
      .map(
        (match) => `<item>
      <title>${escapeXml(`${match.homeTeam} vs ${match.awayTeam} en Vivo - ${match.leagueDisplayName}`)}</title>
      <link>${buildCanonical(`/partido/${match.slug}`)}</link>
      <guid>${buildCanonical(`/partido/${match.slug}`)}</guid>
      <pubDate>${new Date(match.isoDateTime).toUTCString()}</pubDate>
      <description>${escapeXml(`Ver ${match.homeTeam} vs ${match.awayTeam} en vivo hoy. ${match.channelCount} canales disponibles.`)}</description>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}


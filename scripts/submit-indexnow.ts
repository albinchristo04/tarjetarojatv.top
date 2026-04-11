import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { SITE_URL } from '../src/lib/config';
import { getRenderableLeagueGroups, getSiteData } from '../src/lib/data';
import { buildCanonical, buildIndexNowUrl } from '../src/lib/seo';

const cacheFile = process.env.INDEXNOW_CACHE_FILE || resolve(process.cwd(), '.cache/indexnow/last-urls.json');
const key = process.env.INDEXNOW_KEY;

function readCachedUrls(): string[] {
  if (!existsSync(cacheFile)) {
    return [];
  }

  try {
    return JSON.parse(readFileSync(cacheFile, 'utf8')) as string[];
  } catch {
    return [];
  }
}

function writeCachedUrls(urls: string[]) {
  mkdirSync(dirname(cacheFile), { recursive: true });
  writeFileSync(cacheFile, `${JSON.stringify(urls, null, 2)}\n`);
}

function buildUrlList() {
  const siteData = getSiteData();
  const fixedRoutes = [
    '/',
    '/futbol',
    '/beisbol',
    '/mlb',
    '/nba',
    '/nhl',
    '/motogp',
    '/tarjeta-roja',
    '/pirlo-tv',
    '/roja-directa-pirlo-tv',
    '/tarjeta-roja-pirlo-tv',
  ];

  const urls = new Set<string>();

  fixedRoutes.forEach((pathname) => urls.add(buildCanonical(pathname)));
  getRenderableLeagueGroups().forEach((group) => urls.add(buildCanonical(`/${group.slug}`)));
  siteData.teams.forEach((team) => urls.add(buildCanonical(`/equipo/${team.slug}`)));
  siteData.matches.forEach((match) => {
    urls.add(buildCanonical(`/partido/${match.slug}`));
    urls.add(buildCanonical(`/ver/${match.slug}`));
    urls.add(buildCanonical(`/en-vivo/${match.slug}`));
  });

  return [...urls];
}

async function main() {
  const urlList = buildUrlList();
  const previousUrls = new Set(readCachedUrls());
  const changedUrls = urlList.filter((url) => !previousUrls.has(url)).slice(0, 10_000);

  if (!key) {
    console.warn('INDEXNOW_KEY is not set. Skipping submission and refreshing local cache only.');
    writeCachedUrls(urlList);
    return;
  }

  if (changedUrls.length === 0) {
    console.log('No changed URLs to submit to IndexNow.');
    writeCachedUrls(urlList);
    return;
  }

  const response = await fetch('https://www.bing.com/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key,
      keyLocation: buildIndexNowUrl(),
      urlList: changedUrls,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '(no body)');
    throw new Error(
      `IndexNow submission failed with status ${response.status}\n` +
      `  keyLocation: ${buildIndexNowUrl()}\n` +
      `  host: ${new URL(SITE_URL).host}\n` +
      `  urlCount: ${changedUrls.length}\n` +
      `  response: ${body}`
    );
  }

  console.log(`Submitted ${changedUrls.length} changed URLs to IndexNow.`);
  writeCachedUrls(urlList);
}

main();


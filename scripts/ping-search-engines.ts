import { SITE_URL } from '../src/lib/config';

const endpoints = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`,
];

async function main() {
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      console.log(`Pinged ${endpoint} -> ${response.status}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Ping failed for ${endpoint}: ${message}`);
    }
  }
}

main();


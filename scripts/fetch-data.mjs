import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DATA_URL =
  'https://raw.githubusercontent.com/albinchristo04/arda/refs/heads/main/rereyano_data.json';
const currentPath = resolve(process.cwd(), 'src/data/rereyano_data.current.json');

async function main() {
  mkdirSync(dirname(currentPath), { recursive: true });

  try {
    const response = await fetch(DATA_URL, {
      headers: {
        'user-agent': 'tarjetarojatv.top-build',
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const payload = await response.json();
    const eventCount = Array.isArray(payload.events) ? payload.events.length : 0;

    if (eventCount === 0) {
      if (existsSync(currentPath)) {
        console.warn('Fetched live data but received 0 events. Keeping existing current snapshot.');
      } else {
        console.warn('Fetched live data but received 0 events. Falling back to committed snapshot.');
      }
      return;
    }

    writeFileSync(currentPath, `${JSON.stringify(payload, null, 2)}\n`);
    console.log(`Saved ${eventCount} live events to src/data/rereyano_data.current.json`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (existsSync(currentPath)) {
      console.warn(`Fetch failed (${message}). Keeping existing current snapshot.`);
      return;
    }

    console.warn(`Fetch failed (${message}). Build will use the committed fallback snapshot.`);
  }
}

main();


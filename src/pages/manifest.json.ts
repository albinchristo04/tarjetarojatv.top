import { buildManifest } from '../lib/seo';

export function GET() {
  return new Response(JSON.stringify(buildManifest(), null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
}


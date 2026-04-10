import { buildRobotsContent } from '../lib/seo';

export function GET() {
  return new Response(buildRobotsContent(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}


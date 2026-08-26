// src/app/robots.ts
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/static/', '/*.json$'],
    },
    sitemap: 'https://tariffecomuni.it/sitemap.xml',
    host: 'https://tariffecomuni.it',
  };
}
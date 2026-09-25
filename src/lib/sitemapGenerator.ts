import { Product, DownloadFile, DocSection } from '../types';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  title?: string;
}

/**
 * Generate XML Sitemap dynamically based on platform contents
 */
export function generateSitemapXml(
  products: Product[] = [],
  downloads: DownloadFile[] = [],
  docs: DocSection[] = [],
  baseUrl: string = 'https://samymsood-eng.github.io/SM-2'
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const entries: SitemapUrlEntry[] = [
    {
      loc: `${cleanBase}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      title: 'SM+2 Platform Official Homepage',
    },
    {
      loc: `${cleanBase}/#sales`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.95,
      title: 'Digital Products & Systems Catalog',
    },
    {
      loc: `${cleanBase}/#downloads`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.95,
      title: 'Direct Software Binaries & Releases',
    },
    {
      loc: `${cleanBase}/#developer`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.85,
      title: 'Developer Support & Documentation',
    },
  ];

  // Dynamic Products
  products.forEach((prod) => {
    entries.push({
      loc: `${cleanBase}/#sales-${prod.id}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      title: `${prod.name} (${prod.version})`,
    });
  });

  // Dynamic Downloads
  downloads.forEach((dl) => {
    entries.push({
      loc: `${cleanBase}/#downloads-${dl.id}`,
      lastmod: dl.releaseDate || today,
      changefreq: 'weekly',
      priority: 0.9,
      title: `${dl.title} - ${dl.fileName}`,
    });
  });

  // Dynamic Docs
  docs.forEach((doc) => {
    entries.push({
      loc: `${cleanBase}/#developer-doc-${doc.slug || doc.id}`,
      lastmod: doc.lastUpdated || today,
      changefreq: 'monthly',
      priority: 0.8,
      title: doc.title,
    });
  });

  const xmlEntries = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(2)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>`;
}

/**
 * Generate robots.txt dynamically
 */
export function generateRobotsTxt(baseUrl: string = 'https://samymsood-eng.github.io/SM-2'): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Direct link to dynamically updated XML Sitemap
Sitemap: ${cleanBase}/sitemap.xml
`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

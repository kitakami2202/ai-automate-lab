import type { CollectionEntry } from 'astro:content';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const SITE_URL = 'https://ai-automate-lab.com';

export function generateArticleSitemapEntries(
  articles: CollectionEntry<'articles'>[]
): SitemapEntry[] {
  return articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}/`,
    lastmod: (article.data.updatedDate || article.data.publishedDate).toISOString(),
    changefreq: 'monthly' as const,
    priority: 0.7,
  }));
}

export function getStaticPageEntries(): SitemapEntry[] {
  return [
    { url: `${SITE_URL}/`, changefreq: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about/`, changefreq: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/glossary/`, changefreq: 'monthly', priority: 0.6 },
  ];
}

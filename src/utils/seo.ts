export interface SEOMeta {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

const SITE_NAME = 'AI Automate Lab';
const SITE_URL = 'https://ai-automate-lab.tech';

export function generateTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`;
}

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function generateOgImageUrl(category?: string, slug?: string): string {
  if (category && slug) {
    return `${SITE_URL}/og-images/${category}/${slug}.png`;
  }
  if (slug) {
    return `${SITE_URL}/og-images/${slug}.png`;
  }
  return `${SITE_URL}/og-images/default.png`;
}

export function generateMeta(meta: SEOMeta) {
  return {
    title: generateTitle(meta.title),
    description: meta.description,
    ogImage: meta.ogImage || generateOgImageUrl(),
    canonicalUrl: meta.canonicalUrl || SITE_URL,
    type: meta.type || 'website',
    publishedTime: meta.publishedTime,
    modifiedTime: meta.modifiedTime,
    tags: meta.tags || [],
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
  };
}

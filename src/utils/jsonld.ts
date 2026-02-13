import type { CollectionEntry } from 'astro:content';
import { categoryLabels } from './categories';

const SITE_URL = 'https://ai-automate-lab.tech';
const SITE_NAME = 'AI Automate Lab';

const authorSchema = {
  '@type': 'Person',
  name: 'れん',
  url: `${SITE_URL}/about`,
  jobTitle: 'AI業務自動化コンサルタント',
  description: 'ITコンサルティング出身。GAS業務自動化5年・40件以上の構築実績。AIデータ分析・解析調査を専門とし、中小企業のAI業務自動化を支援。',
  knowsAbout: [
    'Google Apps Script',
    'AI API連携',
    'Discord Bot開発',
    '業務自動化',
    'データ分析',
  ],
  sameAs: [
    `${SITE_URL}/about`,
  ],
};

const publisherSchema = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon.svg`,
  },
};

export function generateJsonLd(
  article: CollectionEntry<'articles'>,
  url: string,
  headings: { depth: number; text: string }[]
) {
  const schemas: object[] = [];

  switch (article.data.schema.type) {
    case 'HowTo':
      schemas.push(generateHowTo(article, url, headings));
      break;
    case 'FAQPage':
      schemas.push(generateFAQPage(article));
      break;
    case 'ItemList':
      schemas.push(generateItemList(article, url, headings));
      break;
    case 'Article':
    default:
      schemas.push(generateArticle(article, url));
  }

  if (article.data.schema.type !== 'FAQPage' && article.data.faq.length > 0) {
    schemas.push(generateFAQPage(article));
  }

  // BreadcrumbList は Breadcrumb.astro コンポーネント側で生成するため、ここでは省略

  return schemas.map(s => JSON.stringify(s));
}

function generateHowTo(
  article: CollectionEntry<'articles'>,
  url: string,
  headings: { depth: number; text: string }[]
) {
  const steps = headings
    .filter(h => h.depth === 3 && /ステップ\d+/.test(h.text))
    .map((h, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: h.text,
      url: `${url}#${encodeURIComponent(h.text)}`,
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: article.data.title,
    description: article.data.description,
    image: `${SITE_URL}${article.data.ogImage || `/og-images/${article.slug}.png`}`,
    totalTime: article.data.schema.totalTime,
    estimatedCost: article.data.schema.estimatedCost
      ? { '@type': 'MonetaryAmount', currency: 'JPY', value: article.data.schema.estimatedCost }
      : undefined,
    step: steps,
    author: authorSchema,
    datePublished: article.data.publishedAt.toISOString(),
    dateModified: article.data.updatedAt.toISOString(),
  };
}

function generateFAQPage(article: CollectionEntry<'articles'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.data.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function generateArticle(article: CollectionEntry<'articles'>, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.data.title,
    description: article.data.description,
    image: `${SITE_URL}${article.data.ogImage || `/og-images/${article.slug}.png`}`,
    author: authorSchema,
    publisher: publisherSchema,
    datePublished: article.data.publishedAt.toISOString(),
    dateModified: article.data.updatedAt.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}

function generateItemList(
  article: CollectionEntry<'articles'>,
  url: string,
  headings: { depth: number; text: string }[]
) {
  const items = headings
    .filter(h => h.depth === 2 || h.depth === 3)
    .map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: h.text,
      url: `${url}#${encodeURIComponent(h.text)}`,
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: article.data.title,
    description: article.data.description,
    numberOfItems: items.length,
    itemListElement: items,
  };
}

function generateBreadcrumb(article: CollectionEntry<'articles'>, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryLabels[article.data.category] || article.data.category, item: `${SITE_URL}/category/${article.data.category}` },
      { '@type': 'ListItem', position: 3, name: article.data.title, item: url },
    ],
  };
}

export function generateWebSiteJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: '中小企業のAI業務自動化を、フレームワークで再現可能にするナレッジベース',
  });
}

// Legacy exports for backward compatibility during migration
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  });
}

export function generateFAQJsonLd(items: { question: string; answer: string }[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  });
}

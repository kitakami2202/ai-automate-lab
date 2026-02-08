import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(160),
    category: z.enum([
      'gas', 'discord-bot', 'ai-api', 'no-code', 'frameworks', 'reviews'
    ]),
    tags: z.array(z.string()).min(1).max(8),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: z.string().default('れん'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    timeToRead: z.number().min(1).max(60),
    layer: z.enum(['entry', 'execution']),
    articleType: z.enum(['pillar', 'howto', 'comparison', 'framework', 'reference']),
    schema: z.object({
      type: z.enum(['HowTo', 'FAQPage', 'Article', 'ItemList']),
      estimatedCost: z.string().optional(),
      totalTime: z.string().optional(),
    }),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).min(1).max(10),
    relatedArticles: z.array(z.string()).min(1).max(5),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };

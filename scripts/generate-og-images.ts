import { generateOgImage } from '../src/utils/og-image';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { glob } from 'glob';

async function main() {
  const files = await glob('src/content/articles/**/*.md');
  let generated = 0;
  let skipped = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data } = matter(content);
    const slug = path.basename(file, '.md');
    const category = path.basename(path.dirname(file));
    const outputPath = path.join('public/og-images', category, `${slug}.png`);

    try {
      await fs.access(outputPath);
      skipped++;
      continue;
    } catch {
      // File doesn't exist, generate it
    }

    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    const buffer = await generateOgImage(data.title, category);
    await fs.writeFile(outputPath, buffer);
    console.log(`Generated: ${outputPath}`);
    generated++;
  }

  console.log(`\nOGP画像生成完了: ${generated}件生成、${skipped}件スキップ`);
}

main();

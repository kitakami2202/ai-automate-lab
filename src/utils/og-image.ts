import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';

const fontData = fs.readFileSync('./src/assets/fonts/NotoSansJP-Bold.ttf');

const categoryColors: Record<string, string> = {
  gas: '#0F9D58',
  'discord-bot': '#5865F2',
  'ai-api': '#FF6B35',
  'no-code': '#7C3AED',
  frameworks: '#2563EB',
  reviews: '#DC2626',
};

export async function generateOgImage(title: string, category: string): Promise<Buffer> {
  const color = categoryColors[category] || '#2563EB';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 80px',
          background: `linear-gradient(135deg, ${color} 0%, #1a1a2e 100%)`,
          color: '#ffffff', fontFamily: 'Noto Sans JP',
        },
        children: [
          { type: 'div', props: { style: { fontSize: '48px', fontWeight: 'bold', lineHeight: 1.4 }, children: title } },
          { type: 'div', props: { style: { marginTop: 'auto', fontSize: '24px', opacity: 0.8 }, children: 'AI Automate Lab' } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: 'Noto Sans JP', data: fontData, weight: 700, style: 'normal' }] }
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}

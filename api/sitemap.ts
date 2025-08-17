import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const ROOT_SITEMAP = 'https://myriadcooking.com/sitemap_index.xml';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1) جيب السايتماپ الرئيسي
    const { data } = await axios.get(ROOT_SITEMAP, { timeout: 20000 });
    const parsed = await parseStringPromise(data);

    // 2) استخرج الروابط ديال السايتماپات الفرعية
    const sitemaps: string[] =
      parsed?.sitemapindex?.sitemap?.map((s: any) => s.loc?.[0]).filter(Boolean) || [];

    const urls: string[] = [];

    // 3) دوز على كل سايتماپ فرعي وجمع الروابط
    for (const sm of sitemaps) {
      const { data: childXml } = await axios.get(sm, { timeout: 20000 });
      const childParsed = await parseStringPromise(childXml);
      const items = childParsed?.urlset?.url || [];
      for (const it of items) {
        const loc = it?.loc?.[0];
        if (loc && typeof loc === 'string') urls.push(loc);
      }
    }

    // 4) رجّع JSON
    res.status(200).json({ count: urls.length, urls });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'unexpected_error' });
  }
}

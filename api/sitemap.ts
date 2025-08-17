import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as xml2js from 'xml2js';

const ROOT_SITEMAP = 'https://myriadcooking.com/sitemap_index.xml';

async function fetchXml(url: string) {
  const { data } = await axios.get(url, {
    timeout: 20000,
    headers: { 'User-Agent': 'webpilot-alt/1.0 (+https://vercel.app)' }
  });
  return xml2js.parseStringPromise(data);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const root = await fetchXml(ROOT_SITEMAP);
    let urls: string[] = [];

    if (root?.sitemapindex?.sitemap) {
      const childMaps: string[] = root.sitemapindex.sitemap
        .map((s: any) => s.loc?.[0])
        .filter(Boolean);

      for (const sm of childMaps) {
        const child = await fetchXml(sm);
        const items = child?.urlset?.url || [];
        for (const it of items) {
          const loc = it?.loc?.[0];
          if (typeof loc === 'string') urls.push(loc);
        }
      }
    } else if (root?.urlset?.url) {
      urls = root.urlset.url.map((u: any) => u.loc?.[0]).filter(Boolean);
    }

    res.status(200).json({ count: urls.length, urls });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'unexpected_error' });
  }
}

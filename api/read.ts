import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ code: 'method_not_allowed', message: 'Use POST' });

  const { link, ur, lp, rt, l } = req.body || {};
  if (!link || !ur || typeof lp !== 'boolean' || !l) {
    return res.status(400).json({ code: 'bad_request', message: 'Missing required fields: link, ur, lp, l' });
  }

  // مؤقتاً: رد تجريبي باش نختبرو الربط
  return res.status(200).json({
    title: "Dummy title for " + link,
    content: "Extracted content placeholder for testing. Replace with real scraping.",
    meta: { source: link },
    links: [link],
    extra_search_results: [
      { title: "Related A", link, snippet: "Snippet A" }
    ],
    todo: ["Summarize", "Compare"],
    tips: ["Use plain yogurt for heating"],
    rules: ["Do not copy verbatim", "Cite sources when used"]
  });
}

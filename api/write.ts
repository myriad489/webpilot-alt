import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ code: 'method_not_allowed', message: 'Use POST' });
  }

  const { content } = req.body || {};
  if (!content) {
    return res.status(400).json({ code: 'bad_request', message: 'Missing required field: content' });
  }

  // مؤقتاً: رد تجريبي باش نتأكد أن الخدمة خدامة
  return res.status(200).json({
    message: "Content received successfully",
    received: content,
    tips: ["Use sitemap for internal linking", "Ensure content relevance"],
    status: "ok"
  });
}

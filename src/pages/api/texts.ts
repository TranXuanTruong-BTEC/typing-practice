import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const texts = await db.collection('typingTexts').find({}).toArray();
    res.status(200).json(texts);
  } catch (error) {
    console.error('API /api/texts error:', error);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
} 
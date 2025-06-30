import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).end();
  try {
    const client = await clientPromise;
    const db = client.db();
    const { id, ...update } = req.body;
    await db.collection('typingTexts').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
} 
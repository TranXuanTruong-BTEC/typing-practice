import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();
  try {
    const client = await clientPromise;
    const db = client.db();
    const { id } = req.body;
    let deleteResult = null;
    try {
      // Thử xóa theo ObjectId (MongoDB _id)
      deleteResult = await db.collection('typingTexts').deleteOne({ _id: new ObjectId(id) });
    } catch (_) {
      // Nếu id không phải ObjectId, thử xóa theo trường id (string)
      deleteResult = await db.collection('typingTexts').deleteOne({ id });
    }
    if (deleteResult && deleteResult.deletedCount > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Không tìm thấy bài tập để xóa.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
} 
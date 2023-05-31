import { connectDB } from '../../../../util/database';

const handler = async (req: any, res: any) => {
  try {
    const db = (await connectDB).db('forum');
    await db.collection('post').insertOne(req.body);
    return res.redirect(302, '/');
  } catch (err) {
    return res.status(500).json('error');
  }
};

export default handler;

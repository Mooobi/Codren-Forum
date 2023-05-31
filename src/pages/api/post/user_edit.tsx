import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../util/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const db = (await connectDB).db('test');

    let result = await db
      .collection('users')
      .updateOne(
        { name: req.body.name, image: req.body.image },
        { $set: { email: req.body.email } }
      );
    console.log(result);
  }
  res.redirect(302, '/');
};

export default handler;

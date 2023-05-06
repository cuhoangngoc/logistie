import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('logistie');

      const user = await db
        .collection('users')
        .find({ email: req.query.email }, { projection: { password: 0 } })
        .limit(1)
        .toArray();

      res.json(user[0]);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' });
  }
}

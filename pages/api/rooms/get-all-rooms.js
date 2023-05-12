import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = await clientPromise;

    const rooms = await client
      .db('logistie')
      .collection('rooms')
      .find({})
      .toArray();

    res.status(200).json(rooms);
  }
}

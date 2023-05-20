import clientPromise from '../../../lib/mongodb';
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const appointments = await client
        .db('logistie')
        .collection('appointments')
        .find({})
        .toArray();
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' });
  }
}

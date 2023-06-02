import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = await client.db('logistie');

      const result = await db
        .collection('requests')
        .aggregate([
          {
            $lookup: {
              from: 'departments',
              localField: 'department_id',
              foreignField: '_id',
              as: 'department',
            },
          },
          {
            $unwind: {
              path: '$department',
            },
          },
        ])
        .toArray();
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  } else {
    // method not allowed
    res.status(405).json({ message: 'Method not allowed' });
  }
}

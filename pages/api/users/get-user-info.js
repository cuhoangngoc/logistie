import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;

      const result = await client
        .db('logistie')
        .collection('users')
        .aggregate([
          {
            $match: {
              email: req.query.email,
            },
          },
          {
            $project: {
              password: 0,
            },
          },
          {
            $lookup: {
              from: 'departments',
              localField: 'user_metadata.department_id',
              foreignField: '_id',
              as: 'user_metadata.department',
            },
          },
          {
            $unwind: '$user_metadata.department',
          },
        ])
        .limit(1)
        .toArray();

      res.status(200).json(result[0]);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' });
  }
}

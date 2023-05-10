import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('logistie');

      // for each department, get the list of employees that belong to it, hide password
      const departments = await db
        .collection('departments')
        .aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'employees',
              foreignField: '_id',
              as: 'employees',
            },
          },
        ])
        .project({ 'employees.password': 0 })
        .sort({ name: 1 })
        .toArray();

      res.json(departments);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' });
  }
}

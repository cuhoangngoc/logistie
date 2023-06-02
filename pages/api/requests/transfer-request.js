import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = await client.db('logistie');
      const { request_id, department_id } = req.body;

      const result = await db.collection('requests').updateOne(
        { _id: new ObjectId(request_id) },
        {
          $set: {
            status: 'transferred',
            department_id: new ObjectId(department_id),
          },
        }
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  } else {
    // method not allowed
    res.status(405).json({ message: 'Method not allowed' });
  }
}

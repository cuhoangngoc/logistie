import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // get data from request body
      const { title, description, department, user_id } = req.body;

      // save to db
      const client = await clientPromise;
      const db = await client.db('logistie');

      // auto generate created_at and updated_at field
      const now = new Date();

      const result = db.collection('requests').insertOne({
        title,
        description,
        department_id: new ObjectId(department),
        user_id: new ObjectId(user_id),
        status: 'pending',
        created_at: now,
        updated_at: now,
      });

      res.status(200).json({ message: 'save request' });
    } catch (err) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  } else {
    // method not allowed
    res.status(405).json({ message: 'Method not allowed' });
  }
}

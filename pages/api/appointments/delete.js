import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = await client.db('logistie');
      const result = await db
        .collection('appointments')
        .deleteOne({ _id: new ObjectId(req.query.id) });

      console.log(result);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  } else res.status(400).json({ message: 'Wrong HTTP method' });
}

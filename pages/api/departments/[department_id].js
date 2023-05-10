import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const user_id = req.body.user_id.split('|')[1];
      const department_id = req.query.department_id;
      const client = await clientPromise;
      const response = await client
        .db('logistie')
        .collection('departments')
        .updateOne(
          { _id: new ObjectId(department_id) },
          { $push: { employees: new ObjectId(user_id) } }
        );

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

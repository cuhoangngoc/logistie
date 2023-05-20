import { data } from 'autoprefixer';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const client = await clientPromise;
      const db = await client.db('logistie');
      const { id, updatedData } = req.body;

      // if updatedData.exDate exists, assign it to new Date(updatedData.exDate) else assign undefined
      if (updatedData?.exDate)
        updatedData.exDate = new Date(updatedData.exDate);
      if (updatedData?.startDate)
        updatedData.startDate = new Date(updatedData.startDate);
      if (updatedData?.endDate)
        updatedData.endDate = new Date(updatedData.endDate);
      if (updatedData?.location)
        updatedData.location = new ObjectId(updatedData.location);

      if (updatedData?.members) {
        updatedData.members = updatedData.members.map((member) => {
          return new ObjectId(member);
        });
      }

      const result = await db
        .collection('appointments')
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updatedData } },
          { upsert: true }
        );

      // if (result.modifiedCount === 0)
      //   return res.status(404).json({ message: 'Appointment not found' });

      res.status(200).json({ message: 'Appointment updated' });
    } catch (error) {
      res.status(400).json({
        message: 'Something went wrong',
      });
    }
  } else
    res.status(400).json({
      message: 'Wrong HTTP method',
    });
}

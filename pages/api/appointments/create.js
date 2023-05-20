import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const checkConflict = async (data) => {
  const client = await clientPromise;
  const db = await client.db('logistie');

  // get recurring rules
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      data.location = new ObjectId(data.location);
      data.members = data.members.map((member) => new ObjectId(member));
      data.startDate = new Date(data.startDate);
      data.endDate = new Date(data.endDate);
      if (data._id) data._id = new ObjectId();

      const client = await clientPromise;
      const db = await client.db('logistie');

      // a room cannot have 2 appointments at the same time
      // some appointments may be recurring, we need to check all of them
      // here is the recurring rule RRULE:INTERVAL=1;FREQ=DAILY;UNTIL=20230512T170100Z or RRULE:INTERVAL=1;FREQ=DAILY;COUNT=30

      const appointments = await db
        .collection('appointments')
        .find({
          location: data.location,
          $or: [
            {
              startDate: {
                $gte: data.startDate,
                $lt: data.endDate,
              },
            },
            {
              endDate: {
                $gt: data.startDate,
                $lte: data.endDate,
              },
            },
          ],
        })
        .toArray();

      // a member cannot have 2 appointments at the same time
      const members = await db
        .collection('appointments')
        .find({
          members: {
            $in: data.members,
          },
          $or: [
            {
              startDate: {
                $gte: data.startDate,
                $lt: data.endDate,
              },
            },
            {
              endDate: {
                $gt: data.startDate,
                $lte: data.endDate,
              },
            },
          ],
        })
        .toArray();

      if (appointments.length > 0)
        res.status(400).json({
          statusCode: 400,
          message: 'There is already an appointment at this time',
        });

      if (members.length > 0)
        res.status(400).json({
          statusCode: 400,
          message:
            'One of the members is already in an appointment at this time',
        });

      // create appointment if there is no conflict and return it

      const result = await db.collection('appointments').insertOne(data);

      const output = await db.collection('appointments').findOne({
        _id: result.insertedId,
      });

      res.status(200).json(output);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method Not Allowed' });
  }
}

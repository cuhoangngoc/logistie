import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const startOfDate = new Date(today);
  startOfDate.setHours(0, 0, 0, 0);
  const endOfDate = new Date(today);
  endOfDate.setHours(23, 59, 59, 999);

  const client = await clientPromise;

  // find all employees whose birthday is today
  const result = await client
    .db('logistie')
    .collection('users')
    .find({
      'user_metadata.birthday': {
        $exists: true,
        $gte: startOfDate,
        $lte: endOfDate,
      },
    })
    .toArray();

  res.json(result);
}

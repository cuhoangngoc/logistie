import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

  result.forEach((user) => {
    // Add a news of birthday for each user
    client
      .db('logistie')
      .collection('news')
      .insertOne({
        user_id: new ObjectId(user._id),
        content: `Hôm nay là sinh nhật của <strong>${user.name}</strong>! Hãy gửi lời chúc tới bạn ấy nhé!`,
        type: 'birthday',
        publicId: null,
        imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL}/public/imgs/birthday.jpg}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
  });

  res.json(result);
}

import { MongoClient } from 'mongodb';
import moment from 'moment-timezone';

// Lấy MONGO_URL từ file .env.local
const MONGO_URL = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Lấy thông tin từ body request
  const { title, content, imageSrc, publicId, user_id } = req.body;
  const created_at = moment().tz('UTC').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  const updated_at = moment().tz('UTC').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

  // Kết nối tới MongoDB
  const client = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Chọn database và collection cần truy vấn
    const db = client.db('logistie');
    const collection = db.collection('news');

    // Thêm bản tin mới vào collection
    const result = await collection.insertOne({
      user_id,
      title,
      content,
      imageSrc,
      publicId,
      updated_at: new Date(updated_at),
      created_at: new Date(created_at),
    });

    // Trả về kết quả thành công
    res.status(201).json({ message: 'Thêm bản tin thành công!', result });
  } catch (e) {
    // Trả về lỗi nếu có
    res.status(500).json({ message: e.message });
  } finally {
    // Đóng kết nối tới MongoDB
    client.close();
  }
}

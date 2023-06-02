import { MongoClient, ObjectId } from 'mongodb';

// Lấy MONGO_URL từ file .env.local
const MONGO_URL = process.env.MONGO_URI;

export default async function handler(req, res) {
  // Lấy id từ request params
  const { id } = req.query;

  // Kết nối tới MongoDB
  const client = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Chọn database và collection cần truy vấn
    const db = client.db('logistie');
    const collection = db.collection('news');

    // Truy vấn tìm news theo id
    const result = await collection.findOne({ _id: new ObjectId(id) });

    // Trả về kết quả tìm được
    res.status(200).json(result);
  } catch (e) {
    // Trả về lỗi nếu có
    res.status(500).json({ message: e.message });
  } finally {
    // Đóng kết nối tới MongoDB
    client.close();
  }
}

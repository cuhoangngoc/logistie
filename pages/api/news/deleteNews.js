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

    // Chuyển _id sang kiểu ObjectId của MongoDB
    const objectId = new ObjectId(id);

    // Thực hiện xóa bản tin từ collection news
    const result = await collection.deleteOne({ _id: objectId });

    // Kiểm tra xem có xóa được hay không
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Xóa bản tin thành công.' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy bản tin để xóa.' });
    }
  } catch (e) {
    // Trả về lỗi nếu có
    res.status(500).json({ message: e.message });
  } finally {
    // Đóng kết nối tới MongoDB
    client.close();
  }
}

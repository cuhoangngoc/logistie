import { MongoClient, ObjectId } from "mongodb";
import moment from 'moment-timezone';

// Lấy MONGO_URL từ file .env.local
const MONGO_URL = process.env.MONGO_URL;

export default async function handler(req, res) {
    // Lấy id từ request params
    const { title, content, user_id } = req.query;
    const created_at = moment().tz('UTC').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const updated_at = moment().tz('UTC').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    // Kết nối tới MongoDB
    const client = await MongoClient.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        // Chọn database và collection cần truy vấn
        const db = client.db("logistie");
        const collection = db.collection("news");

        // Truy vấn tìm news theo id
        const result = await collection.insertOne({user_id, title, content, updated_at, created_at});

        // Trả về kết quả tìm được
        res.status(201).json({ message: "Thêm bản tin thành công!", result });
    } catch (e) {
        // Trả về lỗi nếu có
        res.status(500).json({ message: e.message });
    } finally {
        // Đóng kết nối tới MongoDB
        client.close();
    }
}

import { MongoClient } from "mongodb";

// Lấy MONGO_URL từ file .env.local
const MONGO_URL = process.env.MONGO_URI;

export default async function handler(req, res) {
    // Kết nối tới MongoDB
    const client = await MongoClient.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const database = client.db("logistie"); // thay đổi tên database của bạn ở đây
        const newsCollection = database.collection("news"); // thay đổi tên collection của bạn ở đây

        // Thực hiện truy vấn tới collection news ở đây
        const news = await newsCollection.find({}).toArray();

        res.status(200).json(news);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
}

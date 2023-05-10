import { MongoClient, ObjectId } from 'mongodb';
import moment from 'moment-timezone';

const MONGO_URL = process.env.MONGO_URL;

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(400).json({ message: 'Invalid method' });
    }

    const { id, title, content } = req.query;
    const updated_at = moment().tz('UTC').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    if (!id || !title || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const client = await MongoClient.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const newsCollection = client.db('logistie').collection('news');

        const result = await newsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, content, updated_at } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json({ message: 'News updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
    } finally {
        await client.close();
    }
}

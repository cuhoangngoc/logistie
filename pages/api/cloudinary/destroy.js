import { cloudinary, getPublicIdFromUrl } from '../../../lib/cloudinary';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const public_id = getPublicIdFromUrl(req.body.secure_url);

    try {
      const result = cloudinary.v2.uploader.destroy(public_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

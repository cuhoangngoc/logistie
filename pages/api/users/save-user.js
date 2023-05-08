import { ObjectId } from 'mongodb';
import axios from 'axios';
import askForToken from '../../../lib/ask-for-token';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // convert department_id to ObjectId
      const department_id = new ObjectId(req.body.user_metadata.department_id);
      req.body.user_metadata.department_id = department_id;

      const token = await askForToken();
      const options = {
        method: 'POST',
        url: process.env.API_AUDIENCE + '/users',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: req.body,
      };

      const result = await axios.request(options);

      if (result.status === 201) res.status(200).json(result.data);

      res.status(500).json({ statusCode: 500, message: 'Error' });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
}

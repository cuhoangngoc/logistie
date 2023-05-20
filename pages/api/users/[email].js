import clientPromise from '../../../lib/mongodb';
import askForToken from '../../../lib/ask-for-token';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const client = await clientPromise;
      const { user_metadata, picture } = req.body;

      if (!user_metadata) {
        return res.status(400).json({ error: 'Missing user_metadata' });
      }

      // convert birthday string to Date
      user_metadata.birthday = new Date(user_metadata.birthday);

      const email = req.query.email;

      const userToBeUpdated = await client.db('logistie').collection('users').findOne({ email });

      // in case user changes picture, we need to delete the old one from cloudinary
      if (picture !== userToBeUpdated.picture && userToBeUpdated.picture) {
        try {
          console.log(userToBeUpdated.picture);
          await axios.post(`${process.env.API_URL}/cloudinary/destroy`, {
            secure_url: userToBeUpdated.picture,
          });
        } catch (e) {
          res.status(500).json({ error: e.message });
        }
      }

      const updatedUser = await client
        .db('logistie')
        .collection('users')
        .findOneAndUpdate(
          { email },
          {
            $set: {
              user_metadata: {
                ...userToBeUpdated.user_metadata,
                ...user_metadata,
              },
              picture: picture ?? userToBeUpdated.picture,
              updated_at: new Date(),
            },
          },
          {
            returnDocument: 'after',
          }
        );

      // update user in auth0
      const token = await askForToken();
      const data = {
        user_metadata: {
          ...userToBeUpdated.user_metadata,
          ...user_metadata,
        },
      };

      // if (picture) {
      //   data.picture = picture;
      //   data.connection = process.env.AUTH0_CONNECTION;
      // }

      // console.log(data);

      const auth0User = await axios.patch(
        `${process.env.API_AUDIENCE}/users/auth0|${updatedUser.value._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      delete updatedUser.value.password;
      res.status(200).json(updatedUser.value);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

import axios from 'axios';

const askForToken = async () => {
  // ask auth0 for a token

  const options = {
    method: 'POST',
    url: 'https://uit.au.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    data: {
      client_id: '0K668W7OcJai8dxyakEjybKGhdtPFaEW',
      client_secret:
        'oozdqGt4RiXcixBylY6AnzJpnNqOmHJry8FOF3uZgApvm973bj7tA_5lUl48LwD0',
      audience: 'https://uit.au.auth0.com/api/v2/',
      grant_type: 'client_credentials',
    },
  };

  const response = await axios.request(options);
  return response.data.access_token;
};

export default askForToken;

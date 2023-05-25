export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
    try {
      res.status(200).json({ name: 'John Doe' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

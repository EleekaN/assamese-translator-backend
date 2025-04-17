const axios = require('axios');

module.exports = async (req, res) => {
  // ✅ Handle preflight request for CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const { text, source, target } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          q: text,
          source,
          target,
          format: 'text',
          key: apiKey,
        },
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    res.status(200).json({ translatedText });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed' });
  }
};

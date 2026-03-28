const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Gesundheitscheck – um zu testen ob der Server läuft
app.get('/', (req, res) => {
  res.json({ status: 'Proxy läuft!' });
});

// Proxy-Route
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key nicht konfiguriert' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Fehler:', error);
    res.status(500).json({ error: 'Anfrage an OpenRouter fehlgeschlagen' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});



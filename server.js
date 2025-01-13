import express from 'express';
import cors from 'cors';
import ollama from 'ollama';

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for querying Ollama
app.post('/query-ollama', async (req, res) => {
  const { model = 'llama2-uncensored', prompt } = req.body;

  // Validate input
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing prompt' });
  }

  try {
    // Query Ollama API
    const response = await ollama.chat({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    // Send back the response from Ollama
    res.json({ message: response.message.content });
  } catch (error) {
    console.error('Error querying Ollama:', error.message);
    res.status(500).json({ error: 'Failed to query Ollama', details: error.message });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
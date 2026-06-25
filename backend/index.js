const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { generateContentIdeas } = require('./routes/content');
const { analyzeProfile } = require('./routes/profile');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'brandforge-ai-backend' });
});

app.post('/api/content/generate', async (req, res, next) => {
  try {
    const { niche, goal, content_type } = req.body || {};

    if (!niche || !goal || !content_type) {
      return res.status(400).json({
        error: 'Missing required fields: niche, goal, content_type',
      });
    }

    const result = await generateContentIdeas({ niche, goal, content_type });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

app.post('/api/profile/analyze', async (req, res, next) => {
  try {
    const { name, bio, platform, goals } = req.body || {};

    if (!name || !bio || !platform || !goals) {
      return res.status(400).json({
        error: 'Missing required fields: name, bio, platform, goals',
      });
    }

    const result = await analyzeProfile({ name, bio, platform, goals });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Brandforge AI backend running on http://localhost:${port}`);
});

function extractText(response) {
  if (typeof response === 'string') {
    return response;
  }

  const candidate = response?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const text = parts.map((part) => part.text || '').join('');
  return text || '';
}

function normalizeJsonText(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith('```json')) {
    return trimmed.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  }

  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }

  return trimmed;
}

async function requestGeminiJson(prompt, fallbackValue) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return fallbackValue;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = normalizeJsonText(extractText(data));

  try {
    return JSON.parse(text);
  } catch (error) {
    return fallbackValue;
  }
}

module.exports = {
  requestGeminiJson,
};

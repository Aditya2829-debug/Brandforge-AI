const { createContentPrompt } = require('../prompts/profilePrompts');
const { requestGeminiJson } = require('../services/geminiService');

function fallbackContentIdeas({ niche, goal, content_type }) {
  const baseTopic = niche.trim();
  const format = content_type.trim();

  return {
    ideas: [
      { title: `How ${baseTopic} solves ${goal.toLowerCase()}`, type: format },
      { title: `3 mistakes people make in ${baseTopic}`, type: format },
      { title: `A simple framework for better ${baseTopic}`, type: format },
      { title: `${baseTopic} tips for faster results`, type: format },
      { title: `Behind the scenes of a ${baseTopic} workflow`, type: format },
      { title: `What I learned improving ${baseTopic}`, type: format },
      { title: `Common myths about ${baseTopic}`, type: format },
      { title: `A beginner guide to ${baseTopic}`, type: format },
      { title: `How to measure ${baseTopic} success`, type: format },
      { title: `Next steps after mastering ${baseTopic}`, type: format },
    ],
  };
}

async function generateContentIdeas(payload) {
  const prompt = createContentPrompt(payload);

  try {
    return await requestGeminiJson(prompt, fallbackContentIdeas(payload));
  } catch (error) {
    return fallbackContentIdeas(payload);
  }
}

module.exports = {
  generateContentIdeas,
};

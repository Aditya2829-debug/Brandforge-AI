const { createProfilePrompt } = require('../prompts/profilePrompts');
const { requestGeminiJson } = require('../services/geminiService');

function fallbackProfileAnalysis({ name, bio, platform, goals }) {
  const bioLength = bio.trim().length;
  const goalText = goals.trim();

  return {
    brand_strengths: [
      `${name} already signals a clear identity on ${platform}`,
      bioLength > 80 ? 'Bio has enough detail to tell a story' : 'Bio is short and easy to scan',
      'Profile can be turned into a stronger trust signal with sharper proof points',
    ],
    brand_weaknesses: [
      'Add a clearer value proposition in the first line of the bio',
      'Include specific proof, metrics, or social proof to improve authority',
      'Reduce generic language and tie the profile directly to a business outcome',
    ],
    content_recommendations: [
      `Share a weekly update showing progress toward: ${goalText}`,
      `Post a before/after breakdown of how you improved your ${platform} profile`,
      'Create a carousel or thread explaining the main transformation you help people achieve',
    ],
    posting_tips: [
      `Keep the first line of the bio aligned with ${goalText}`,
      'Use one clear CTA so visitors know the next step',
      'Repeat the same value proposition across bio, posts, and featured content',
    ],
  };
}

async function analyzeProfile(payload) {
  const prompt = createProfilePrompt(payload);

  try {
    return await requestGeminiJson(prompt, fallbackProfileAnalysis(payload));
  } catch (error) {
    return fallbackProfileAnalysis(payload);
  }
}

module.exports = {
  analyzeProfile,
};

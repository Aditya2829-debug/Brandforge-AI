function createProfilePrompt({ name, bio, platform, goals }) {
  return `You are a world-class personal brand strategist and marketing expert.
Analyze the following personal branding information and provide structured feedback.

User Profile:
- Name: ${name}
- Bio: ${bio}
- Platform: ${platform}
- Goals: ${goals}

Return ONLY valid JSON with this shape:
{
  "brand_strengths": ["..."],
  "brand_weaknesses": ["..."],
  "content_recommendations": ["..."],
  "posting_tips": ["..."]
}

Use concise, actionable language.`;
}

function createContentPrompt({ niche, goal, content_type }) {
  return `You are an Instagram growth expert.

Niche: ${niche}
Goal: ${goal}
Content Type: ${content_type}

Generate 10 content ideas.

Return ONLY valid JSON in this format:
{
  "ideas": [
    { "title": "Idea title", "type": "${content_type}" }
  ]
}`;
}

module.exports = {
  createProfilePrompt,
  createContentPrompt,
};

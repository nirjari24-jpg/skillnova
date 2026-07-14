const { GoogleGenAI } = require('@google/genai');

// Helper to get AI instance
function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

exports.analyzeSkills = async (req, res) => {
  try {
    const { profile, skills } = req.body;
    if (!profile || !skills) {
      return res.status(400).json({ error: 'Profile and skills are required.' });
    }

    const ai = getAI();
    const prompt = `You are a professional career advisor and skill analyst. A user has provided the following information:

Background/Education: ${profile}
Current Skills: ${skills}

Analyze their skills and respond ONLY with a valid JSON object (no markdown, no explanation) in this exact format:
{
  "score": <number between 0-100>,
  "strengths": [<list of 2-4 strong skills they have>],
  "weaknesses": [<list of 2-4 areas they need to improve>],
  "suggestions": [<list of 3-5 concrete, actionable suggestions>],
  "missingSkills": [<list of 3-5 important skills they are missing for a tech career>]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text.trim();
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (error) {
    console.error('analyzeSkills error:', error.message);
    res.status(500).json({ error: 'Failed to analyze skills. Please try again.' });
  }
};

exports.discoverCareers = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { profile, skills } = req.body;
    
    // In production, we would use the Gemini API to analyze this against our career library.
    // Mocking an intelligent response based on the "Python + Statistics + SQL" example.
    res.json({
      matches: [
        {
          careerId: 1, // Data Scientist
          title: "Data Scientist",
          matchPercentage: 92,
          why: "Your strong background in Python, SQL, and Statistics makes you a perfect fit for uncovering data insights.",
          missingSkills: ["Machine Learning", "Advanced Calculus"],
          nextSteps: "Start learning foundational Machine Learning algorithms and build a predictive model."
        },
        {
          careerId: 3, // AI Engineer
          title: "AI Engineer",
          matchPercentage: 85,
          why: "You already have the programming logic needed; you just need to dive deep into neural networks.",
          missingSkills: ["Deep Learning", "TensorFlow", "Cloud Computing"],
          nextSteps: "Take a Deep Learning specialization course."
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.chatAssistant = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getAI();

    // Build a conversation-aware prompt
    const systemPrompt = `You are NOVA, an expert AI career mentor for SkillNova platform. You help students and professionals with:
- Career guidance and roadmaps
- Skill gap analysis  
- Interview preparation
- Learning resource recommendations
- Motivation and goal setting

Be friendly, concise, and actionable. Keep responses under 150 words unless a detailed explanation is needed.`;

    // Format history for context
    let conversationContext = '';
    if (history.length > 0) {
      conversationContext = history.slice(-6).map(m => 
        `${m.role === 'user' ? 'User' : 'NOVA'}: ${m.content}`
      ).join('\n');
      conversationContext = `\nConversation so far:\n${conversationContext}\n`;
    }

    const fullPrompt = `${systemPrompt}${conversationContext}\nUser: ${message}\nNOVA:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: fullPrompt,
    });

    res.json({ reply: response.text.trim() });
  } catch (error) {
    console.error('chatAssistant error:', error.message);
    res.status(500).json({ error: 'Failed to get response from NOVA. Please try again.' });
  }
};

exports.mockInterview = async (req, res) => {
  try {
    const { career } = req.body;
    if (!career) {
      return res.status(400).json({ error: 'Career field is required.' });
    }

    const ai = getAI();
    const prompt = `You are an expert interviewer for the tech industry. Generate a mock interview for someone applying to be a ${career}.

Respond ONLY with a valid JSON object (no markdown) in this exact format:
{
  "questions": [
    { "id": 1, "question": "<question>", "type": "behavioral", "tip": "<short tip to answer this well>" },
    { "id": 2, "question": "<question>", "type": "technical", "tip": "<short tip>" },
    { "id": 3, "question": "<question>", "type": "behavioral", "tip": "<short tip>" },
    { "id": 4, "question": "<question>", "type": "technical", "tip": "<short tip>" },
    { "id": 5, "question": "<question>", "type": "situational", "tip": "<short tip>" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text.trim();
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (error) {
    console.error('mockInterview error:', error.message);
    res.status(500).json({ error: 'Failed to generate interview questions.' });
  }
};

exports.generateRoadmap = async (req, res) => {
  try {
    const { career, currentLevel = 'beginner' } = req.body;
    if (!career) {
      return res.status(400).json({ error: 'Career is required.' });
    }

    const ai = getAI();
    const prompt = `You are a career roadmap expert. Create a detailed learning roadmap for someone who wants to become a ${career}. Their current level is: ${currentLevel}.

Respond ONLY with a valid JSON object (no markdown) in this exact format:
{
  "title": "${career} Roadmap",
  "totalDuration": "<e.g. 6-12 months>",
  "phases": [
    {
      "phase": 1,
      "title": "<phase title>",
      "duration": "<e.g. 1-2 months>",
      "topics": ["<topic1>", "<topic2>", "<topic3>"],
      "resources": ["<free resource or course>", "<another resource>"]
    }
  ]
}
Include 3-4 phases covering foundation to advanced.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text.trim();
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (error) {
    console.error('generateRoadmap error:', error.message);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
};

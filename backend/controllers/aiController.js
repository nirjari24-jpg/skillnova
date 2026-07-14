const { GoogleGenAI } = require('@google/genai');

exports.analyzeSkills = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { profile, skills } = req.body;
    
    // In production, we would use the Gemini API to analyze this.
    // For now, returning a structured mock response.
    res.json({
      score: 75,
      strengths: ['Analytical Thinking', 'Problem Solving'],
      weaknesses: ['Advanced Mathematics', 'Cloud Deployment'],
      suggestions: ['Focus on learning AWS or Azure', 'Take a statistics course'],
      missingSkills: ['Cloud Computing', 'Statistics']
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { message } = req.body;
    
    res.json({ reply: `NOVA Assistant says: I'm here to help you achieve your career goals! You asked about: ${message}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.mockInterview = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { career } = req.body;
    
    res.json({
      questions: [
        `What makes you interested in becoming a ${career}?`,
        `Describe a challenging project related to ${career} and how you handled it.`
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

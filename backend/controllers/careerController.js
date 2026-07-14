const mockCareers = [
  // TECHNOLOGY
  {
    id: 1,
    title: 'Data Scientist',
    category: 'Technology',
    salaryRange: '$90k - $160k',
    overview: 'Data Scientists analyze complex data to help companies make better decisions using machine learning and advanced statistics.',
    requiredSkills: [
      { name: 'Python', requiredPercentage: 90 },
      { name: 'SQL', requiredPercentage: 80 },
      { name: 'Statistics', requiredPercentage: 85 },
      { name: 'Machine Learning', requiredPercentage: 75 }
    ],
    tools: ['Jupyter', 'Pandas', 'TensorFlow', 'Scikit-Learn'],
    beginnerRoadmap: ['Learn Python basics', 'Understand SQL & Databases', 'Master basic Statistics'],
    advancedRoadmap: ['Build Machine Learning Models', 'Deep Learning fundamentals', 'Model Deployment (MLOps)'],
    futureScope: 'Extremely high demand as AI adoption accelerates globally.',
    recommendedCourses: [
      { name: 'Machine Learning Specialization', platform: 'Coursera', level: 'Intermediate', duration: '3 months', freePaid: 'Paid', certificate: true },
      { name: 'Python for Data Science', platform: 'edX', level: 'Beginner', duration: '4 weeks', freePaid: 'Free', certificate: false }
    ],
    projectIdeas: ['House Price Prediction Model', 'Customer Churn Classification', 'Recommendation System']
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    category: 'Technology',
    salaryRange: '$80k - $140k',
    overview: 'Full Stack Developers build both the front-end (user interface) and back-end (server & database) of web applications.',
    requiredSkills: [
      { name: 'JavaScript/TypeScript', requiredPercentage: 90 },
      { name: 'React', requiredPercentage: 85 },
      { name: 'Node.js', requiredPercentage: 80 },
      { name: 'Databases (SQL/NoSQL)', requiredPercentage: 75 }
    ],
    tools: ['VS Code', 'Git', 'Docker', 'Vite'],
    beginnerRoadmap: ['HTML/CSS fundamentals', 'JavaScript mastery', 'Learn React'],
    advancedRoadmap: ['Node.js & Express API building', 'Database Design', 'Cloud Deployment'],
    futureScope: 'Stable, high demand role as businesses continue digitizing operations.',
    recommendedCourses: [
      { name: 'The Complete Web Development Bootcamp', platform: 'Udemy', level: 'Beginner', duration: '60 hours', freePaid: 'Paid', certificate: true },
      { name: 'Full Stack Open', platform: 'University of Helsinki', level: 'Intermediate', duration: '12 weeks', freePaid: 'Free', certificate: true }
    ],
    projectIdeas: ['E-commerce Store Front & Back', 'Social Media Dashboard', 'Task Management App']
  },
  {
    id: 3,
    title: 'AI Engineer',
    category: 'Technology',
    salaryRange: '$110k - $180k',
    overview: 'AI Engineers build, test, and deploy artificial intelligence models and infrastructure.',
    requiredSkills: [
      { name: 'Python', requiredPercentage: 95 },
      { name: 'Deep Learning', requiredPercentage: 85 },
      { name: 'Cloud Computing', requiredPercentage: 80 },
      { name: 'Software Engineering', requiredPercentage: 75 }
    ],
    tools: ['PyTorch', 'TensorFlow', 'AWS/GCP', 'Docker'],
    beginnerRoadmap: ['Advanced Python', 'Math for ML', 'Basic Neural Networks'],
    advancedRoadmap: ['LLM Fine-tuning', 'Transformers', 'Scalable AI Deployment'],
    futureScope: 'Currently one of the fastest-growing and highest-paying roles in tech.',
    recommendedCourses: [
      { name: 'Deep Learning Specialization', platform: 'Coursera', level: 'Advanced', duration: '4 months', freePaid: 'Paid', certificate: true }
    ],
    projectIdeas: ['Custom Chatbot via API', 'Image Recognition System', 'AI Agent Builder']
  },
  {
    id: 4,
    title: 'Cyber Security Analyst',
    category: 'Technology',
    salaryRange: '$75k - $130k',
    overview: 'Cyber Security Analysts protect IT infrastructure, edge devices, networks, and data from attacks.',
    requiredSkills: [
      { name: 'Networking', requiredPercentage: 85 },
      { name: 'Operating Systems', requiredPercentage: 80 },
      { name: 'Risk Analysis', requiredPercentage: 75 },
      { name: 'Scripting (Python/Bash)', requiredPercentage: 70 }
    ],
    tools: ['Wireshark', 'Kali Linux', 'Metasploit', 'Splunk'],
    beginnerRoadmap: ['Learn Networking (TCP/IP)', 'Linux OS Basics', 'Security Fundamentals'],
    advancedRoadmap: ['Penetration Testing', 'Incident Response', 'Advanced Cryptography'],
    futureScope: 'Critical demand worldwide due to rising cyber threats.',
    recommendedCourses: [
      { name: 'Google Cybersecurity Certificate', platform: 'Coursera', level: 'Beginner', duration: '6 months', freePaid: 'Paid', certificate: true }
    ],
    projectIdeas: ['Network Traffic Analyzer', 'Basic Keylogger (Educational)', 'Vulnerability Scanner']
  },
  // BUSINESS
  {
    id: 5,
    title: 'Product Manager',
    category: 'Business',
    salaryRange: '$90k - $160k',
    overview: 'Product Managers guide the success of a product and lead the cross-functional team that is responsible for improving it.',
    requiredSkills: [
      { name: 'Agile Methodology', requiredPercentage: 85 },
      { name: 'Data Analysis', requiredPercentage: 75 },
      { name: 'User Research', requiredPercentage: 80 },
      { name: 'Strategic Thinking', requiredPercentage: 90 }
    ],
    tools: ['Jira', 'Figma', 'Mixpanel', 'Notion'],
    beginnerRoadmap: ['Understand Agile', 'Learn User Interviewing', 'Basic Analytics'],
    advancedRoadmap: ['Go-to-Market Strategy', 'Advanced Prioritization Frameworks', 'P&L Management'],
    futureScope: 'High demand as companies focus on user-centric product development.',
    recommendedCourses: [
      { name: 'Product Management 101', platform: 'Udemy', level: 'Beginner', duration: '10 hours', freePaid: 'Paid', certificate: true }
    ],
    projectIdeas: ['Product Requirements Document for an app', 'Competitor Analysis Report', 'Wireframe Prototype']
  },
  // CREATIVE
  {
    id: 6,
    title: 'UI/UX Designer',
    category: 'Creative',
    salaryRange: '$70k - $120k',
    overview: 'UI/UX Designers create user-friendly interfaces that understand and fulfill user needs.',
    requiredSkills: [
      { name: 'Figma/Design Tools', requiredPercentage: 95 },
      { name: 'User Research', requiredPercentage: 80 },
      { name: 'Wireframing', requiredPercentage: 90 },
      { name: 'Color Theory & Typography', requiredPercentage: 85 }
    ],
    tools: ['Figma', 'Adobe XD', 'Framer', 'Miro'],
    beginnerRoadmap: ['Learn Figma Basics', 'Color & Typography Fundamentals', 'Design simple screens'],
    advancedRoadmap: ['Build Design Systems', 'Advanced Prototyping', 'Usability Testing'],
    futureScope: 'Steady demand as digital experiences require premium aesthetics.',
    recommendedCourses: [
      { name: 'Google UX Design Certificate', platform: 'Coursera', level: 'Beginner', duration: '6 months', freePaid: 'Paid', certificate: true }
    ],
    projectIdeas: ['Redesign a popular app', 'Create a comprehensive Design System', 'E-commerce User Flow']
  }
];

exports.getAllCareers = async (req, res) => {
  try {
    res.json(mockCareers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = mockCareers.find(c => c.id === parseInt(req.params.id));
    if (!career) return res.status(404).json({ message: 'Career not found' });
    res.json(career);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

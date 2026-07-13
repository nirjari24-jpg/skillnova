exports.getAllCareers = async (req, res) => {
  try {
    const careers = [
      {
        id: 1,
        title: 'Data Scientist',
        category: 'Data & Analytics',
        salaryRange: '$80k - $150k',
        icon: '📊',
        description: 'Analyze complex datasets to extract insights and build predictive models.',
        skillsRequired: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Data Visualization'],
        topCompanies: ['Google', 'Meta', 'Netflix', 'Amazon'],
        demandLevel: 'Very High',
        avgTime: '8-12 months to job-ready'
      },
      {
        id: 2,
        title: 'AI / ML Engineer',
        category: 'Artificial Intelligence',
        salaryRange: '$90k - $180k',
        icon: '🤖',
        description: 'Design, build, and deploy machine learning models and AI systems at scale.',
        skillsRequired: ['Python', 'TensorFlow/PyTorch', 'MLOps', 'Cloud Platforms', 'Mathematics'],
        topCompanies: ['OpenAI', 'Google DeepMind', 'Anthropic', 'Microsoft'],
        demandLevel: 'Very High',
        avgTime: '10-18 months to job-ready'
      },
      {
        id: 3,
        title: 'Full Stack Developer',
        category: 'Software Engineering',
        salaryRange: '$70k - $130k',
        icon: '💻',
        description: 'Build complete web applications from frontend UI to backend APIs and databases.',
        skillsRequired: ['JavaScript', 'React', 'Node.js', 'SQL/NoSQL', 'REST APIs'],
        topCompanies: ['Startups', 'Accenture', 'Infosys', 'TCS'],
        demandLevel: 'High',
        avgTime: '6-10 months to job-ready'
      },
      {
        id: 4,
        title: 'Cloud Engineer',
        category: 'DevOps & Cloud',
        salaryRange: '$85k - $160k',
        icon: '☁️',
        description: 'Design and manage cloud infrastructure, deployment pipelines, and scalable systems.',
        skillsRequired: ['AWS/Azure/GCP', 'Docker', 'Kubernetes', 'Linux', 'Terraform'],
        topCompanies: ['AWS', 'Microsoft Azure', 'Google Cloud', 'IBM'],
        demandLevel: 'High',
        avgTime: '8-14 months to job-ready'
      },
      {
        id: 5,
        title: 'Cybersecurity Analyst',
        category: 'Security',
        salaryRange: '$75k - $140k',
        icon: '🛡️',
        description: 'Protect systems and networks from cyber threats through monitoring and response.',
        skillsRequired: ['Network Security', 'Python', 'Linux', 'Ethical Hacking', 'SIEM Tools'],
        topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'IBM Security', 'Deloitte'],
        demandLevel: 'High',
        avgTime: '9-15 months to job-ready'
      },
      {
        id: 6,
        title: 'Product Manager',
        category: 'Product & Strategy',
        salaryRange: '$80k - $170k',
        icon: '🎯',
        description: 'Define product vision, strategy, and roadmap while working across engineering and design.',
        skillsRequired: ['Product Strategy', 'Agile/Scrum', 'Data Analysis', 'User Research', 'Roadmapping'],
        topCompanies: ['Google', 'Apple', 'Spotify', 'Airbnb'],
        demandLevel: 'Medium-High',
        avgTime: '6-12 months transition'
      },
    ];
    res.json(careers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // In production, this would query a database
    res.json({
      id,
      title: 'Career Details',
      description: 'Full career details would be fetched from database.',
      skillsRequired: ['Skill A', 'Skill B', 'Skill C'],
      roadmap: [
        { step: 1, title: 'Foundation', topics: ['Core concepts', 'Basic tools'] },
        { step: 2, title: 'Intermediate', topics: ['Projects', 'Advanced concepts'] },
        { step: 3, title: 'Advanced', topics: ['Specialization', 'Portfolio'] }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

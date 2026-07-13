exports.getAllCareers = async (req, res) => {
  try {
    const mockCareers = [
      { id: 1, title: 'Data Scientist', category: 'Data', salaryRange: '$80k - $150k' },
      { id: 2, title: 'AI Engineer', category: 'Engineering', salaryRange: '$90k - $160k' },
      { id: 3, title: 'Web Developer', category: 'Engineering', salaryRange: '$60k - $120k' },
    ];
    res.json(mockCareers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    res.json({ 
      id: req.params.id, 
      title: 'Sample Career', 
      description: 'Detailed description for this career.',
      skillsRequired: ['Skill A', 'Skill B'],
      roadmap: ['Step 1', 'Step 2', 'Step 3']
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

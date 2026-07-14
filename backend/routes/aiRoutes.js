const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/analyze', aiController.analyzeSkills);
router.post('/discover', aiController.discoverCareers);
router.post('/chat', aiController.chatAssistant);
router.post('/interview', aiController.mockInterview);
router.post('/roadmap', aiController.generateRoadmap);

module.exports = router;

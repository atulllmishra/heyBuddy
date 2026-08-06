const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const chatController = require('../controllers/chatController');

router.post('/video/generate', videoController.generateVideo);
router.get('/video/options', videoController.getOptions);
router.post('/video/render-async', videoController.startAsyncJob);
router.get('/video/job/:jobId', videoController.getJobStatus);
router.post('/video/translate', videoController.translateVideo);

router.post('/chat/doubt', chatController.handleDoubtChat);

router.get('/topics/sample', (req, res) => {
  res.json([
    { id: 'photosynthesis', title: 'Photosynthesis & Light Reactions', category: 'Biology', icon: '🌱' },
    { id: 'newton', title: "Newton's 3 Laws of Motion", category: 'Physics', icon: '🚀' },
    { id: 'quantum', title: 'Quantum Entanglement & Superposition', category: 'Quantum Physics', icon: '⚛️' }
  ]);
});

module.exports = router;

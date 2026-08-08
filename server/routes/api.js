const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const chatController = require('../controllers/chatController');
const userController = require('../controllers/userController');
const telemetryController = require('../controllers/telemetryController');

// Primary & Alias Masterclass Video Generation Endpoints
router.post('/generate-lecture', videoController.generateVideo);
router.post('/video/generate', videoController.generateVideo);

router.get('/video/options', videoController.getOptions);
router.post('/video/render-async', videoController.startAsyncJob);
router.get('/video/job/:jobId', videoController.getJobStatus);
router.post('/video/translate', videoController.translateVideo);
router.post('/video/tts-sarvam', videoController.synthesizeSarvamTTS);
router.post('/video/tts-elevenlabs', videoController.synthesizeElevenLabs);

router.post('/academic-data', videoController.getAcademicData);
router.get('/heygen/avatars-voices', videoController.getHeyGenCatalog);
router.post('/heygen/generate-video', videoController.generateHeyGenVideo);

router.post('/chat/doubt', chatController.handleDoubtChat);

// YouTube-Grade Telemetry v3 Endpoints
router.post('/v3/telemetry/event', telemetryController.ingestEvent);
router.get('/v3/videos/stats', telemetryController.getVideoStats);
router.get('/v3/channels/stats', telemetryController.getChannelStats);
router.get('/v3/telemetry/stream', telemetryController.telemetryStream);

// Library Endpoints
router.get('/library', userController.getLibrary);
router.post('/library', userController.addToLibrary);
router.delete('/library/:id', userController.removeFromLibrary);

// History Endpoints
router.get('/history', userController.getHistory);
router.post('/history', userController.addHistory);
router.delete('/history', userController.clearHistory);

// Analytics & Profile Endpoints
router.get('/analytics', userController.getAnalytics);
router.get('/user/profile', userController.getProfile);
router.post('/user/profile', userController.updateProfile);

router.get('/topics/sample', (req, res) => {
  res.json([
    { id: 'photosynthesis', title: 'Photosynthesis & Light Reactions', category: 'Biology', icon: '🌱' },
    { id: 'newton', title: "Newton's 3 Laws of Motion", category: 'Physics', icon: '🚀' },
    { id: 'quantum', title: 'Quantum Entanglement & Superposition', category: 'Quantum Physics', icon: '⚛️' }
  ]);
});

module.exports = router;

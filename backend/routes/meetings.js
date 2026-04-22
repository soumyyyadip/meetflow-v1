const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting
} = require('../controllers/meetingController');

router.get('/', auth, getMeetings);
router.get('/:id', auth, getMeetingById);
router.post('/', auth, createMeeting);
router.patch('/:id', auth, updateMeeting);
router.delete('/:id', auth, deleteMeeting);

module.exports = router;

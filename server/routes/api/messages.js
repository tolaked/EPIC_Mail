import express from 'express';
import messageController from '../../controller/messageController';
import messageValidation from '../../validation/messageValidation';

const {
  createMessage,
  GetAllReceivedMessages,
  GetAllUnreadReceivedMessages,
  GetAllSentMessages,
} = messageController;

const router = express.Router();

router.post('/messages', messageValidation.sendEmail, createMessage);
router.get('/messages', GetAllReceivedMessages);
router.get('/messages/unread', GetAllUnreadReceivedMessages);
router.get('/messages/sent', GetAllSentMessages);

export default router;

import express from 'express';
import messageController from '../../controller/messageController';
import messageValidation from '../../validation/messageValidation';
import Auth from '../../middleware/Auth';

const { verifyToken } = Auth;

const {
  createMessage,
  getAllReceivedMessages,
  getAllUnreadReceivedMessages,
  getAllSentMessages,
  getSpecificMessage,
  deleteSpecificMessage,
} = messageController;

const router = express.Router();

router.post('/messages', verifyToken, messageValidation.sendEmail, createMessage);
router.get('/messages', verifyToken, getAllReceivedMessages);
router.get('/messages/unread', verifyToken, getAllUnreadReceivedMessages);
router.get('/messages/sent', verifyToken, getAllSentMessages);
router.get('/messages/:messageId', verifyToken, getSpecificMessage);
router.delete('/messages/:messageId', verifyToken, deleteSpecificMessage);

export default router;

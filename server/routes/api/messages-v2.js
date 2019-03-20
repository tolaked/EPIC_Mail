import express from 'express';
import messageController from '../../controller/messageControllerV2';
import validateMessage from '../../validation/messageValidation';
import Auth from '../../middleware/Auth';

const { verifyToken } = Auth;

const {
  createMessageV2,
  getAllReceivedMessagesV2,
  getAllUnreadReceivedMessagesV2,
  getAllSentMessagesV2,
  getSpecificMessageV2,
  deleteSpecificMessageV2,
} = messageController;

const router = express.Router();

// post a message route
router.post('/messages', verifyToken, validateMessage.sendEmail, createMessageV2);

// get all received messages route
router.get('/messages', verifyToken, getAllReceivedMessagesV2);

// get all unread messages endpoint
router.get('/messages/unread', verifyToken, getAllUnreadReceivedMessagesV2);

// get all sent messages endpoint
router.get('/messages/sent', verifyToken, getAllSentMessagesV2);

// get specific messages endpoint
router.get('/messages/:messageId', verifyToken, getSpecificMessageV2);

// delete specific messages endpoint
router.delete('/messages/:messageId', verifyToken, deleteSpecificMessageV2);

export default router;

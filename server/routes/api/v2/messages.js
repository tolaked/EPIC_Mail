import express from 'express';
import messageController from '../../../controller/messageControllerV2';
import validateMessage from '../../../validation/messageValidation';
import Auth from '../../../middleware/Auth';

const { verifyToken } = Auth;

const {
  createMessageV2,
  getAllReceivedMessagesV2,
  getAllUnreadReceivedMessagesV2,
  getAllSentMessagesV2,
  getSpecificMessageV2,
  deleteSpecificMessageV2,
} = messageController;

const app = express.Router();

export default (app) => {
  app.post('/messages', verifyToken, validateMessage.sendEmail, createMessageV2);

  app.get('/messages', verifyToken, getAllReceivedMessagesV2);

  // get all unread messages endpoint
  app.get('/messages/unread', verifyToken, getAllUnreadReceivedMessagesV2);

  // get all sent messages endpoint
  app.get('/messages/sent', verifyToken, getAllSentMessagesV2);

  // get specific messages endpoint
  app.get('/messages/:messageId', verifyToken, getSpecificMessageV2);

  // delete specific messages endpoint
  app.delete('/messages/:messageId', verifyToken, deleteSpecificMessageV2);
};

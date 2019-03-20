import express from 'express';
import messageController from '../../../controller/messageController';
import messageValidation from '../../../validation/messageValidation';
import Auth from '../../../middleware/Auth';

const { verifyToken } = Auth;

const {
  createMessage,
  getAllReceivedMessages,
  getAllUnreadReceivedMessages,
  getAllSentMessages,
  getSpecificMessage,
  deleteSpecificMessage,
} = messageController;

const app = express.Router();

export default (app) => {
  app.post('/messages', verifyToken, messageValidation.sendEmail, createMessage);
  app.get('/messages', verifyToken, getAllReceivedMessages);
  app.get('/messages/unread', verifyToken, getAllUnreadReceivedMessages);
  app.get('/messages/sent', verifyToken, getAllSentMessages);
  app.get('/messages/:messageId', verifyToken, getSpecificMessage);
  app.delete('/messages/:messageId', verifyToken, deleteSpecificMessage);
};

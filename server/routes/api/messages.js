import express from 'express';
import messageController from '../../controller/messageController';
import messageValidation from '../../validation/messageValidation';

const { createMessage, GetAllReceivedMessages } = messageController;

const router = express.Router();

router.post('/messages', messageValidation.sendEmail, createMessage);
router.get('/messages', GetAllReceivedMessages);

export default router;

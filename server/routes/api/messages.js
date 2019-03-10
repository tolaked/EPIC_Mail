import express from 'express';
import messageController from '../../controller/messageController';
import messageValidation from '../../validation/messageValidation';

const router = express.Router();

router.post('/messages', messageValidation.sendEmail, messageController.createMessage);

export default router;

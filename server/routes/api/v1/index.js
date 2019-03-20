import express from 'express';
import users from './users';
import messages from './messages';

const app = express.Router();

messages(app);
users(app);

export default app;

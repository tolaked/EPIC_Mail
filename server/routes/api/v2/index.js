import express from 'express';
import users from './users';
import messages from './messages';

const app = express.Router();

users(app);
messages(app);

export default app;

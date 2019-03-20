import express from 'express';
import users from './users';
import messages from './messages';
import groups from './groups';

const app = express.Router();

users(app);
messages(app);
groups(app);

export default app;

import express from 'express';
import UsersController from '../../controller/UsersController';

const router = express.Router();

// post message route
router.post('/signup', UsersController.createUser);

export default router;

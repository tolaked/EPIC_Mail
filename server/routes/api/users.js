import express from 'express';
import UsersController from '../../controller/UsersController';
import validateUser from '../../validation/userValidation';

const router = express.Router();

// post message route
router.post('/signup', validateUser.signup, UsersController.createUser);

router.post('/login', validateUser.signIn, UsersController.login);

export default router;

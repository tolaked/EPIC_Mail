import express from 'express';
import UsersController from '../../controller/UsersController';
import validateUser from '../../validation/userValidation';

const router = express.Router();

const { createUser, login } = UsersController;

// post message route
router.post('/signup', validateUser.signup, createUser);

router.post('/login', validateUser.signIn, login);

export default router;

import express from 'express';
import UsersControllerV2 from '../../controller/UsersControllerV2';
import validateUser from '../../validation/userValidation';

const router = express.Router();

const { createUser, login } = UsersControllerV2;

// post message route
router.post('/signup', validateUser.signup, createUser);

router.post('/login', validateUser.signIn, login);

export default router;

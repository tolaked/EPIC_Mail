import express from 'express';
import UsersControllerV2 from '../../../controller/UsersControllerV2';
import validateUser from '../../../validation/userValidation';
import Auth from '../../../middleware/Auth';

const app = express.Router();

const { createUser, login } = UsersControllerV2;

// post message route
export default (app) => {
  app.post('/auth/signup', validateUser.signup, createUser);

  app.post('/auth/login', validateUser.signIn, login);
};

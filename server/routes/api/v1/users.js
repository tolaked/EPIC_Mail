import express from 'express';
import UsersController from '../../../controller/UsersController';
import validateUser from '../../../validation/userValidation';

const app = express.Router();

const { createUser, login } = UsersController;

// post message route
export default (app) => {
  app.post('/auth/signup', validateUser.signup, createUser);
  app.post('/auth/login', validateUser.signIn, login);
};

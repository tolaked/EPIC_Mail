import express from 'express';
import GroupController from '../../../controller/GroupControllers';
import Auth from '../../../middleware/Auth';

const { verifyToken } = Auth;
const { createGroup } = GroupController;

const app = express.Router();
export default (app) => {
  app.post('/groups', verifyToken, createGroup);
};

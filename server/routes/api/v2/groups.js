import express from 'express';
import GroupController from '../../../controller/GroupControllers';
import Auth from '../../../middleware/Auth';

const { verifyToken } = Auth;
const {
  createGroup,
  getAllGroups,
  editSpecificGroupName,
  deleteSpecificGroup,
  addUserToGroup,
  deleteUserFromGroup,
} = GroupController;

const app = express.Router();
export default (app) => {
  // create a group
  app.post('/groups', verifyToken, createGroup);

  // get all groups
  app.get('/groups', verifyToken, getAllGroups);

  // edit a specific group name
  app.patch('/groups/:groupid/name', verifyToken, editSpecificGroupName);

  // delete a specific group
  app.delete('/groups/:groupid', verifyToken, deleteSpecificGroup);
  // Add a user to group
  app.post('/groups/:groupid/users/', verifyToken, addUserToGroup);

  // Delete a user from group
  app.delete('/groups/:groupid/users/:userid', verifyToken, deleteUserFromGroup);
};

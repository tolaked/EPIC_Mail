import express from 'express';
import GroupController from '../../../controller/GroupControllers';
import Auth from '../../../middleware/Auth';

const { verifyTokendb } = Auth;
const {
  createGroup,
  getAllGroups,
  editSpecificGroupName,
  deleteSpecificGroup,
  addUserToGroup,
  deleteUserFromGroup,
  sendEmailToGroup,
} = GroupController;

const app = express.Router();
export default (app) => {
  // create a group
  app.post('/groups', verifyTokendb, createGroup);

  // get all groups
  app.get('/groups', verifyTokendb, getAllGroups);

  // edit a specific group name
  app.patch('/groups/:groupid/name', verifyTokendb, editSpecificGroupName);

  // delete a specific group
  app.delete('/groups/:groupid', verifyTokendb, deleteSpecificGroup);
  // Add a user to group
  app.post('/groups/:groupid/users/', verifyTokendb, addUserToGroup);

  // Delete a user from group
  app.delete('/groups/:groupid/users/:userid', verifyTokendb, deleteUserFromGroup);

  app.post('/groups/:groupid/messages', verifyTokendb, sendEmailToGroup);
};

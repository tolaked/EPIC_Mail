import DB from '../db/db';

class GroupController {
  static async createGroup(req, res) {
    const { id } = req.user;
    const { body } = req;

    try {
      const queryString = 'INSERT INTO groups(name, admin) VALUES($1, $2) returning *';
      const { rows } = await DB.query(queryString, [body.groupname, id]);

      const queryString2 = 'INSERT INTO groupmembers(groupid, memberid, role) VALUES($1, $2, $3) returning *';
      const groupmember = await DB.query(queryString2, [rows[0].id, id, 'admin']);

      const response = {
        id: groupmember.rows[0].groupid,
        name: rows[0].name,
        role: groupmember.rows[0].role,
      };

      return res.status(201).json({
        status: 201,
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * Get all groups
   * @param {*} req
   * @param {*} res
   */
  static async getAllGroups(req, res) {
    const { id } = req.user;
    
    try {
      const queryString = 'SELECT groups.id, groups.name, groupmembers.role FROM groups LEFT JOIN groupmembers ON groupmembers.groupid = groups.id WHERE groupmembers.memberid = $1';

      const { rows } = await DB.query(queryString, [id]);
      
      return res.status(200).json({
        status: 'success',
        data: rows[0].name,
      });
      
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * Edit specific group name
   * @param {*} req
   * @param {*} res
   */
  static async editSpecificGroupName(req, res) {
    const { id } = req.user;
    const { groupid } = req.params;
    const { body } = req;
    const values = [body.groupname, groupid];

    try {
      const queryString2 = 'SELECT * FROM groupmembers WHERE (groupid, memberid) = ($1, $2)';
      const members = await DB.query(queryString2, [groupid, id]);

      if (members.rows[0].role === 'admin' || members.rows[0].role === 'moderator') {
        const queryString = 'UPDATE groups SET name = $1 WHERE (id) = ($2) returning *';
        const { rows } = await DB.query(queryString, values);
        if (!rows[0]) {
          return res.status(404).json({
            status: 400,
            error: 'message can not be found',
          });
        }
        const response = [{ id: rows[0].id, name: rows[0].name, role: members.rows[0].role }];
        return res.status(200).json({
          status: 200,
          data: response,
        });
      }

      return res.status(400).json({
        status: 400,
        error: 'sorry, you can not edit group name',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   *  Delete specific group
   * @param {*} req
   * @param {*} res
   */
  static async deleteSpecificGroup(req, res) {
    const { id } = req.user;
    const { groupid } = req.params;

    const queryString = 'SELECT * FROM groupmembers WHERE (groupmembers.groupid, groupmembers.memberid, role) = ($1, $2, $3)';
    const { rows } = await DB.query(queryString, [groupid, id, 'admin']);

    // check if user is an admin
    if (!rows[0]) {
      return res.status(400).json({
        status: 400,
        error: 'sorry,this group has been deleted or does not exist',
      });
    }
    const querystr = 'DELETE FROM groupmembers WHERE groupmembers.groupid = $1';
    await DB.query(querystr, [groupid]);

    const queryString2 = 'DELETE FROM groups WHERE groups.id = $1';
    await DB.query(queryString2, [groupid]);

    return res.status(200).json({
      status: 200,
      data: {
        message: 'Group has been deleted successfully',
      },
    });
  }

  /**
   * Add user to group
   * @param {*} req
   * @param {*} res
   */
  static async addUserToGroup(req, res) {
    const { id } = req.user;
    const { groupid } = req.params;
    const { body } = req;

    try {
      const queryString = 'SELECT * FROM groupmembers WHERE (groupmembers.groupid, groupmembers.memberid) = ($1, $2)';
      const { rows } = await DB.query(queryString, [groupid, id]);

      // check if user is an admin or moderator in group
      if (rows.length === 0 || rows[0].role === 'user') {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you can not add a user to this group',
        });
      }

      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const user = await DB.query(userQuery, [body.email]);

      // check if the user exists in our users db
      if (user.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'user not found',
        });
      }

      const userExistQuery = 'SELECT * FROM groupmembers WHERE (groupid, groupmembers.memberid) = ($1, $2)';
      const userExist = await DB.query(userExistQuery, [groupid, user.rows[0].id]);

      // check if user is already a member of the group
      if (userExist.rows.length > 0) {
        return res.status(409).json({
          status: 409,
          error: 'user already a group member',
        });
      }

      const queryString2 = 'INSERT INTO groupmembers(groupid, memberid, role) VALUES($1, $2, $3)';
      await DB.query(queryString2, [groupid, user.rows[0].id, body.role]);

      const responseQuery = 'SELECT * FROM groupmembers WHERE groupid = $1';
      const response = await DB.query(responseQuery, [groupid]);

      return res.status(201).json({
        status: 201,
        data: response.rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  static async deleteUserFromGroup(req, res) {
    const { id } = req.user;
    const { groupid, userid } = req.params;
    try {
      const queryString = 'SELECT * FROM groupmembers WHERE (groupmembers.groupid, groupmembers.memberid) = ($1, $2)';
      const { rows } = await DB.query(queryString, [groupid, id]);

      // check if user is an admin or moderator in group
      if (rows.length === 0 || rows[0].role === 'null') {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you can not delete a user from this group',
        });
      }

      const userExistQuery = 'SELECT * FROM groupmembers WHERE (groupid, groupmembers.memberid) = ($1, $2)';
      const userExist = await DB.query(userExistQuery, [groupid, userid]);
      // check if user is member of the group
      if (userExist.rows.length === 0) {
        return res.status(409).json({
          status: 409,
          error: 'user not a group member',
        });
      }

      const queryString2 = 'DELETE FROM groupmemberS WHERE (groupid, memberid) = ($1, $2) ';
      await DB.query(queryString2, [groupid, userid]);

      return res.status(201).json({
        status: 201,
        data: {
          message: 'user has been removed from group',
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }

    
  }

  static async sendEmailToGroup(req, res) {
    const { id, email } = req.user;
    const { groupid } = req.params;
    const { body } = req;
    try {
      const queryString = 'SELECT * FROM groupmembers WHERE (groupmembers.groupid, groupmembers.memberid) = ($1, $2)';
      const { rows } = await DB.query(queryString, [groupid, id]);

      // check if user belongs to group
      if (rows.length === 0) {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you are not a member of this group',
        });
      }

      const values = [
        body.subject,
        body.message,
        'sent',
        id,
        body.parentmessageid,
        'true',
        groupid,
      ];
      const queryString2 = 'INSERT INTO messages(subject, message, status, createdby, parentmessageid, groupmessage, groupmessageid) VALUES($1, $2, $3, $4, $5, $6, $7) returning *';
      const message = await DB.query(queryString2, values);


      return res.status(201).json({
        status: 201,
        data: message.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error,
      });
    }
  }
 
}

export default GroupController;

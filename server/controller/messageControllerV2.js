import helper from '../helper/helper';
import DB from '../db/db';

class MessageControllerV2 {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async createMessageV2(req, res) {
    const { body } = req;

    const { id } = req.user;

    try {
      // save as draft if status is draft

      if (body.status === 'draft') {
        const values = [body.subject, body.message, body.parentmessageid, body.status, id];
        const queryString = 'INSERT INTO messages(subject, message, parentmessageid, status, createdby) VALUES($1, $2, $3, $4, $5) returning *';
        const { rows } = await DB.query(queryString, values);

        return res.status(201).json({
          status: 201,
          data: {
            rows,
          },
        });
      }

      // check if user inputs are valid

      const queryString = 'SELECT * FROM users WHERE email = $1';
      const receiver = await DB.query(queryString, [body.receiver]);

      // check if user exist in database
      if (!receiver.rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Reciever not a valid user',
        });
      }

      const messagevalues = [id, body.subject, body.message, body.parentmessageid, 'sent'];

      const saveMessagequeryString = 'INSERT INTO messages(createdby, subject, message, parentmessageid, status) VALUES($1, $2, $3, $4, $5) returning *';
      const { rows } = await DB.query(saveMessagequeryString, messagevalues);
      // sent message
    

      const sentqueryString = 'INSERT INTO sent(senderid, messageid) VALUES($1, $2) returning *';
      const sent = [id, rows[0].id];
      await DB.query(sentqueryString, sent);

      // received Message
      const inboxQueryString = 'INSERT INTO inbox(receiverid, messageid) VALUES($1, $2) returning *';
      const inbox = [receiver.rows[0].id, rows[0].id];
      await DB.query(inboxQueryString, inbox);
      const msg = rows[0];
      return res.status(201).json({
        status: 201,
        data: {
          msg,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async getAllReceivedMessagesV2(req, res) {
    const { id } = req.user;

    const queryString = 'SELECT messages.id, messages.createdby, messages.subject, messages.message, messages.parentmessageid, messages.status FROM messages LEFT JOIN inbox ON messages.id = inbox.messageid WHERE inbox.receiverid = $1';
    const { rows } = await DB.query(queryString, [id]);

    return res.status(200).json({
      status: 200,
      data: rows,
    });
  }

  /**
   * get all unread messages from db
   * @param {*} req
   * @param {*} res
   */
  static async getAllUnreadReceivedMessagesV2(req, res) {
    const { id } = req.user;
    // get all read messages by status
    const queryString = 'SELECT messages.id, messages.createdby, messages.subject, messages.message, messages.parentmessageid, messages.status FROM messages LEFT JOIN inbox ON messages.id = inbox.messageid WHERE (inbox.receiverid, messages.status) = ($1, $2)';
    const { rows } = await DB.query(queryString, [id, 'sent']);

    return res.status(200).json({
      status: 200,
      data: rows,
    });
  }

  /**
   *Get all sent messages from db
   * @param {*} req
   * @param {*} res
   */
  static async getAllSentMessagesV2(req, res) {
    const { id } = req.user;

    const queryString = 'SELECT messages.id, messages.createdby, messages.subject, messages.message, messages.parentmessageid, messages.status FROM messages LEFT JOIN sent ON messages.id = sent.messageid WHERE sent.senderid = $1';
    const { rows } = await DB.query(queryString, [id]);

    return res.status(200).json({
      status: 200,
      data: rows,
    });
  }

  /**
   *Get a specific message db
   * @param {*} req
   * @param {*} res
   */
  static async getSpecificMessageV2(req, res) {
    const { messageId } = req.params;
    const { id } = req.user;
    const idParams = parseInt(messageId, 10);

    try {
      const draftquery = 'SELECT * FROM messages WHERE (status, createdby, id) = ($1, $2, $3)';

      const draftmessage = await DB.query(draftquery, ['draft', id, idParams]);

      if (draftmessage.rows[0]) {
        return res.status(200).json({
          status: 200,
          data: draftmessage.rows[0],
        });
      }
      const queryString = 'SELECT messages.id, messages.createdby, messages.subject, messages.message, messages.parentmessageid, messages.status, sent.senderid, inbox.receiverid FROM messages LEFT JOIN inbox ON messages.id = inbox.messageid LEFT JOIN sent ON messages.id = sent.messageid WHERE messages.id = $1';
      const { rows } = await DB.query(queryString, [idParams]);

      if (rows[0].senderid === id) {
        return res.status(200).json({
          status: 200,
          data: rows[0],
        });
      }

      if (rows[0].receiverid === id) {
        const queryStrings = 'UPDATE messages SET STATUS = $1 WHERE ID = $2 returning *';
        const updatedMessage = await DB.query(queryStrings, ['read', rows[0].id]);
        return res.status(200).json({
          status: 200,
          data: updatedMessage.rows[0],
        });
      }
      return res.status(404).json({
        status: 404,
        error: 'message does not exist',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'message cannot be found',
      });
    }
  }

  /**
   * Delete a Specific message from db
   * @param {*} req
   * @param {*} res
   */
  static async deleteSpecificMessageV2(req, res) {
    const { messageId } = req.params;
    const { id } = req.user;
    const singleMessageId = parseInt(messageId, 10);

    try {
      // delete from sent table
      const deletesent = 'DELETE FROM sent WHERE (senderid, messageid) = ($1, $2) returning *';
      const deletedsentmessage = await DB.query(deletesent, [id, singleMessageId]);

      if (deletedsentmessage.rows[0]) {
        // delete from inbox table
        const deleteinbox = 'DELETE FROM inbox WHERE messageid = $1 returning *';
        await DB.query(deleteinbox, [singleMessageId]);
      }

      // delete from message table
      const deleteMessage = 'DELETE FROM messages WHERE (createdby, id) = ($1, $2) returning *';
      const deletedmessage = await DB.query(deleteMessage, [id, singleMessageId]);
      if (deletedmessage.rows[0]) {
        return res.status(200).json({
          status: 200,
          data: `message with id of ${deletedmessage.rows[0].id} has been deleted`,
        });
      }

      return res.status(400).json({
        status: 400,
        error: 'sorry, you are unable to delete this message',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }
}

export default MessageControllerV2;

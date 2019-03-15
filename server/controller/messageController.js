import messageData from '../data/messages';
import inboxData from '../data/inbox';
import sentData from '../data/sent';
import userData from '../data/users';
import helper from '../helper/helper';

const sentPath = 'server/data/sent.json';
const messagePath = 'server/data/messages.json';
const inboxPath = 'server/data/inbox.json';

class MessageController {
  /**
   * create a new message
   *
   * @param {object} req
   * @param {object} res
   */
  static createMessage(req, res) {
    const { body } = req;

    // check if message is a draft and save as draft
    if (body.status === 'draft') {
      // get draft message details
      const values = {
        id: helper.generateId(messageData, 0),
        createdOn: new Date().toUTCString(),
        parentMessageId: null,
      };

      // save data to disk
      const message = helper.saveData(messagePath, messageData, values);

      return res.status(201).json({
        status: 201,
        data: [
          {
            message,
          },
        ],
      });
    }

    // send a new message to a user
    try {
      // find receiver by email
      const receiver = helper.findUserByEmail(userData, body.receiver);

      // find sender by email
      const sender = helper.findUserByEmail(userData, body.sender);

      // check if receiver exist
      if (!receiver) {
        return res.status(404).json({
          status: 404,
          error: 'Address of receiver not recognized',
        });
      }

      // collect user provided data
      const values = {
        id: helper.generateId(messageData, 0),
        createdOn: new Date().toUTCString(),
        subject: body.subject,
        message: body.message,
        parentMessageId: helper.generateId(messageData, 0),
        status: 'sent',
        senderId: sender.id,
        recieverId: receiver.id,
      };

      // sent message
      const sent = {
        senderId: sender.id,
        messageId: values.id,
        createdOn: values.createdOn,
      };

      // receive message
      const inbox = {
        recieverId: receiver.id,
        messageId: values.id,
        createdOn: values.createdOn,
      };

      // save newly created message
      const message = helper.saveData(messagePath, messageData, values);

      // save newly created message as sent message to the sender
      helper.saveData(sentPath, sentData, sent);

      // savve newly created message as inbox for the receiver
      helper.saveData(inboxPath, inboxData, inbox);

      return res.status(201).json({
        status: 201,
        data: [
          {
            message,
          },
        ],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: 'Sorry, something must have gone wrong, try again',
      });
    }
  }

  /**
   * Get all received messages
   *
   * @param {object} req
   * @param {object} res
   */
  static getAllReceivedMessages(req, res) {
    // find all message with status of sent
    const sent = helper.findMessage(messageData, 'sent');

    // find all message with status of read
    const read = helper.findMessage(messageData, 'read');

    // combined sent and read messages into one message array
    const receivedMessages = [...sent, ...read];

    // check if no messages
    if (receivedMessages.length === 0) {
      return res.status(404).json({
        status: 404,
        data: [],
      });
    }

    // sort messages in highest to lowest based on id
    const newReceivedMsg = receivedMessages.sort((a, b) => (a.id < b.id ? 1 : -1));

    // return all matching messages
    return res.status(200).json({
      status: 200,
      data: newReceivedMsg,
    });
  }

  /**
   * Get all unread received messages
   *
   * @param {object} req
   * @param {object} res
   */
  static getAllUnreadReceivedMessages(req, res) {
    const sent = helper.findMessage(messageData, 'sent');

    return res.status(200).json({
      status: 200,
      data: sent,
    });
  }

  /**
   *Get all sent messages
   *
   * @param {object} req
   * @param {object} res
   */
  static getAllSentMessages(req, res) {
    // get all sent messages
    const sent = helper.findMessage(messageData, 'sent');
    const read = helper.findMessage(messageData, 'read');

    const sentMessages = [...read, ...sent];

    const sortedMessages = sentMessages.sort((a, b) => (a.id < b.id ? 1 : -1));

    return res.status(200).json({
      status: 200,
      data: sortedMessages,
    });
  }

  /**
   *
   * Get specific message
   *
   * @param {object} req
   * @param {object} res
   */
  static getSpecificMessage(req, res) {
    // get message id
    const messageId = parseInt(req.params.messageId, 10);

    // check if message id is a number
    if (typeof messageId !== 'number') {
      return res.status(400).json({
        status: 400,
        error: 'Invalid message id',
      });
    }

    // find message by id
    const message = helper.findMessageById(messageData, messageId);

    return res.status(200).json({
      status: 200,
      data: message,
    });
  }

  /**
   * Delete a specific message
   *
   * @param {*} req
   * @param {*} res
   */
  static deleteSpecificMessage(req, res) {
    // check if message id is integer
    const messageId = parseInt(req.params.messageId, 10);

    // check if message id is a number
    if (typeof messageId !== 'number') {
      return res.status(400).json({
        status: 400,
        error: 'Invalid message id',
      });
    }

    // find message by the given id
    const data = helper.filterMessage(messageData, messageId);

    // check if message record exist
    if (data.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'No record found',
      });
    }

    // delete a specific message by id
    const deletedMessage = helper.deleteDataFromFile(messagePath, messageData, data);

    return res.status(200).json({
      status: 200,
      data: [deletedMessage],
    });
  }
}

export default MessageController;

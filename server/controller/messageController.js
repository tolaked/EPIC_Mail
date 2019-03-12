import messageData from '../data/messages';
import inboxData from '../data/inbox';
import sentData from '../data/sent';
import userData from '../data/users';
import helper from '../helper/helper';
import validMessageInput from '../validation/messageValidation';

const sentPath = 'server/data/sent.json';
const messagePath = 'server/data/messages.json';
const inboxPath = 'server/data/inbox.json';

class MessageController {
  /**
   * create a new message
   *
   * @param {*} req
   * @param {*} res
   */
  static createMessage(req, res) {
    const { body } = req;

    // save as draft
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

      const message = helper.saveData(messagePath, messageData, values);
      console.log(message);

      helper.saveData(sentPath, sentData, sent);
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
        error: `${e} Sorry, something must have gone wrong, try again`,
      });
    }
  }

  /**
   * get all received messages
   *
   * @param {object} req
   * @param {object} res
   */
  static GetAllReceivedMessages(req, res) {
    const sent = helper.findMessage(messageData, 'sent');

    const read = helper.findMessage(messageData, 'read');

    // combined sent and read messages into one message array
    const receivedMessages = [...sent, ...read];

    // sort messages in highest to lowest based on id
    const newReceivedMsg = receivedMessages.sort((a, b) => (a.id < b.id ? 1 : -1));

    // check if no messages
    if (newReceivedMsg.length === 0) {
      return res.status(404).json({
        status: 404,
        data: newReceivedMsg,
      });
    }

    // return all matching messages
    return res.status(200).json({
      status: 200,
      data: newReceivedMsg,
    });
  }

  static GetAllUnreadReceivedMessages(req, res) {
    const sent = helper.findMessage(messageData, 'sent');
  
    return res.status(200).json({
      status: 200,
      data: sent,
    });
  }

}

export default MessageController;

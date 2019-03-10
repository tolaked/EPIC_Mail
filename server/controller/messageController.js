import messageData from '../data/messages';
import inboxData from '../data/inbox';
import sentData from '../data/sent';
import userData from '../data/users';
import helper from '../helper/helper';
import validMessageInput from '../validation/messageValidation';

const sentPath = 'server/data/sent.json';
const messagePath ='server/data/messages.json';
const inboxPath='server/data/inbox.json';

class MessageController{
  static createMessage(req, res) {
    const { body } = req;

    // save as draft 
    if(body.status === 'draft') {
      body.id = helper.generateId(messageData, 0);
      body.createdOn = new Date(). toUTCString();
      body.parentMessageId = null;
      const message = helper.saveData(messagePath, messageData, body);
      return res.status(201).json({
        status:201,
        data:[
          {
            message,
          },
        ],
      });
    }
    
    
   
  try{
    const receiver = helper.findUserByEmail(userData, body.receiver);
    const sender = helper.findUserByEmail(userData, body.sender);
  
    
    if(!receiver) {
      return res.status(404).json({
        status:404,
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
}

export default MessageController;
import validator from 'validator';
import Helper from '../helper/helper';

class ValidateMessageInput {
  static sendEmail(req, res, next) {
    const errors = {};
    const { body } = req;

    body.receiver = !Helper.checkIfEmpty(body.receiver) ? body.receiver : '';
    body.message = !Helper.checkIfEmpty(body.message) ? body.message : '';

    if (Helper.checkIfEmpty(body.receiver)) {
      errors.receiver = 'Receiver is a required field';
    }

    if (Helper.checkIfEmpty(body.message)) {
      errors.message = 'Message body is required';
    }

    if (!validator.isEmail(body.receiver)) {
      errors.receiver = 'Reciever email is required';
    }

    // respond with errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 400,
        errors,
      });
    }

    return next();
  }
}

export default ValidateMessageInput;

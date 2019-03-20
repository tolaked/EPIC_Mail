import validator from 'validator';
import Helper from '../helper/helper';

class ValidateInput {
  /**
   *
   * Validate users input values
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static signup(req, res, next) {
    const errors = {};
    const { body } = req;

    body.firstname = !Helper.checkIfEmpty(body.firstname) ? body.firstname : '';
    body.lastname = !Helper.checkIfEmpty(body.lastname) ? body.lastname : '';
    body.email = !Helper.checkIfEmpty(body.email) ? body.email : '';
    body.password = !Helper.checkIfEmpty(body.password) ? body.password : '';

    if (!validator.isLength(body.firstname, { min: 3, max: 30 })) {
      errors.firstname = 'Firstname must be between 3 and 30 characters';
    }

    if (Helper.checkIfEmpty(body.firstname)) {
      errors.firstname = 'Firstname is a required field';
    }

    if (!/^[a-zA-Z]+$/.test(body.firstname)) {
      errors.firstname = 'Firstname can not contain numbers and symbols';
    }

    if (!validator.isLength(body.lastname, { min: 3, max: 30 })) {
      errors.lastname = 'Lastname must be between 3 and 30 characters';
    }

    if (Helper.checkIfEmpty(body.lastname)) {
      errors.lastname = 'Lastname is a required field';
    }

    if (!/^[a-zA-Z]+$/.test(body.lastname)) {
      errors.Lastname = 'Lastname can not contain numbers and symbols';
    }

    if (!validator.isLength(body.email, { min: 5, max: 30 })) {
      errors.email = 'email must be between 5 and 30 characters';
    }

    if (Helper.checkIfEmpty(body.email)) {
      errors.email = 'email is a required field';
    }

    if (!validator.isLength(body.password, { min: 5, max: 30 })) {
      errors.password = 'password must be between 5 and 30 characters';
    }

    if (Helper.checkIfEmpty(body.password)) {
      errors.password = 'password is a required field';
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

  /**
   * validate users sign in input
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static signIn(req, res, next) {
    const errors = {};
    const { body } = req;

    body.email = !Helper.checkIfEmpty(body.email) ? body.email : '';
    body.password = !Helper.checkIfEmpty(body.password) ? body.password : '';

    switch (true) {
      case Helper.checkIfEmpty(body.email):
        errors.email = 'Email is a required field';
        break;
      case Helper.checkIfEmpty(body.password):
        errors.password = 'Password is a required field';
        break;
      case !validator.isEmail(body.email):
        errors.email = 'Email must be a valid email address';
        break;
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

export default ValidateInput;

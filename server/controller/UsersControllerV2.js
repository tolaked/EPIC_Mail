import bcrypt from 'bcryptjs';
import Helper from '../helper/helper';
import Auth from '../middleware/Auth';
import DB from '../db/db';

class UsersControllerV2 {
  /**
   * Create a new user
   *
   * @param {object} req
   * @param {object} res
   */
  static async createUser(req, res) {
    // get request body
    const { body } = req;

    // generate hash from password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password, salt);

    // collect user body data
    const values = [body.firstname, body.lastname, body.email, hash];

    try {
      // query string
      const queryString = 'INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4) returning *';

      // query database
      const { rows } = await DB.query(queryString, values);

      // create token
      const token = Auth.generateToken(rows[0].id);

      // create new contact
      const contact = [rows[0].firstname, rows[0].lastname, rows[0].email];

      const contactQueryString = 'INSERT INTO contacts(firstname, lastname, email) VALUES($1, $2, $3)';
      const contactResult = await DB.query(contactQueryString, contact);

      return res.status(201).json({
        status: 201,
        data: {
          username: rows[0].lastname,
          token,
        },
      });
    } catch (error) {
      // check if user exist
      if (error.routine === '_bt_check_unique') {
        return res.status(409).json({
          status: 409,
          error: 'User already exist',
        });
      }

      return res.status(400).json({
        status: 400,
        errors: error,
      });
    }
  }

  /**
   * log a user in
   *
   * @param {object} req
   * @param {object} res
   */
  static async login(req, res) {
    // get user input data
    const { email, password } = req.body;

    const queryString = 'SELECT * FROM users WHERE email = $1';

    try {
      // Select all user record where email is equal db email
      const { rows } = await DB.query(queryString, [email]);

      // check if user exist in database
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'User not Found',
        });
      }

      // check if user provided password matches user's hashed password in database
      if (!bcrypt.compareSync(password, rows[0].password)) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid Email/Password',
        });
      }

      // generate token
      const token = Auth.generateToken(rows[0].id);

      // return success message
      return res.status(200).json({
        status: 200,
        data: {
          token,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        errors: 'Something went wrong, try again',
      });
    }
  }
}

export default UsersControllerV2;

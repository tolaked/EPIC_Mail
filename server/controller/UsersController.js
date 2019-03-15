import bcrypt from 'bcryptjs';
import usersData from '../data/users';
import Helper from '../helper/helper';
import Auth from '../middleware/Auth';

const userDataPath = 'server/data/users.json';

class UsersController {
  /**
   * Create a new user
   *
   * @param {object} req
   * @param {object} res
   */
  static createUser(req, res) {
    const { body } = req;

    // find user by email
    const user = Helper.findUserByEmail(usersData, body.email);

    // check if user exist
    if (user) {
      return res.status(409).json({
        status: 409,
        error: 'user already exist',
      });
    }

    // genarate a unique id for new user
    const ID = usersData.length > 0 ? usersData[0].id + 1 : 0;
    const salt = bcrypt.genSaltSync(10);

    // collect data from request body
    const values = {
      id: ID,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      password: bcrypt.hashSync(body.password, salt),
    };

    // save new user to data structure
    const newUser = Helper.saveData(userDataPath, usersData, values);

    // get generated token
    const token = Auth.generateToken(newUser.id, values.isAdmin);

    return res.status(201).json({
      status: 201,
      data: [
        {
          username: newUser.lastname,
          token,
        },
      ],
    });
  }

  /**
   * log a user in
   *
   * @param {object} req
   * @param {object} res
   */
  static login(req, res) {
    const { body } = req;

    // find user by email
    const user = Helper.findUserByEmail(usersData, body.email);

    // check if user exist
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'user does not exist',
      });
    }

    // get stored hashed password
    const hashedPassword = user.password;

    // check if user provided password matches existing password
    if (!bcrypt.compareSync(body.password, hashedPassword)) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid email/password',
      });
    }

    // get generated token
    const token = Auth.generateToken(user.id, user.isAdmin);

    return res.status(200).json({
      status: 200,
      data: [
        {
          token,
        },
      ],
    });
  }
}
export default UsersController;

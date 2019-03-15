import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import usersData from '../data/users';
import Helper from '../helper/helper';

dotenv.config();

class Auth {
  /**
   *Generate token
   *
   * @param {number} id

   */
  static generateToken(id) {
    const token = jwt.sign(
      {
        id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '24h' },
    );

    return token;
  }

  /**
   * Verify token
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  static verifyToken(req, res, next) {
    const { token } = req.headers;

    // check if user provides a token
    if (!token) {
      return res.status(403).json({
        status: 403,
        error: 'Unauthorize, please login',
      });
    }

    // check if token is valid
    try {
      // decode and get token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // find user by email
      const user = Helper.findUserById(usersData, decodedToken.id);

      // check if user exist
      if (!user) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid token provided',
        });
      }

      // make current logged in user id available
      req.user = decodedToken;

      next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error,
      });
    }
  }
}

export default Auth;

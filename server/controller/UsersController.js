import fs from 'fs';
import usersData from '../data/users';
import uservalidation from '../validation/userValidation';

const userDataPath = 'server/data/users.json';

class UsersController {
  static createUser(req, res, next) {
    const { body } = req;

    // genarate a unique id
    const ID = usersData.length > 0 ? usersData[0].id + 1 : 0;

    const values = {
      id: ID,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      password: body.password,
    };

    // save new user to data structure
    const newUser = usersData.unshift(values);

    // write data to file
    if (newUser) {
      fs.writeFileSync(userDataPath, JSON.stringify(usersData), 'utf8');
    } else {
      console.log('could not write to disk');
    }

    return res.status(201).json({
      status: 201,
      data: [
        {
          token: '45erkjherht45495783',
        },
      ],
    });
  }

  static login(req, res) {
    const { body } = req;

    const user = usersData.find(currentUser => currentUser.email === body.email);

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'user does not exist',
      });
    }

    if (user.password !== body.password) {
      return res.status(404).json({
        status: 404,
        error: 'Invalid email/password',
      });
    }

    return res.status(200).json({
      status: 200,
      data: [
        {
          token: 'ahd64jfhHG7832KFM5',
        },
      ],
    });
  }
}
export default UsersController;

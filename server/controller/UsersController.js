import fs from 'fs';
import usersData from '../data/users';

const userDataPath = 'server/data/users.json';

class UsersController {
  static createUser(req, res, next) {
    const { body } = req;
    if (!body.password) {
      res.status(404).json({
        status: 404,
        error: 'Please enter password',
      });
    }
    body.id = usersData.length > 0 ? usersData[0].id + 1 : 0;

    console.log(body.id);

    const ress = usersData.unshift(body);
    if (ress !== -1) {
      fs.writeFile(userDataPath, JSON.stringify(usersData), 'utf8', (error) => {
        if (error) console.log(error);
      });
    }
    return res.status(200).json({
      status: 200,
      data: [{
        token: '45erkjherht45495783”',
      },]
    });
  }

  static login(req, res) {
    const { body } = req;
    const custo = usersData.find(e => e.email == body.email);
    if (!custo) {
      return res.status(404).json({
        status: 400,
        error: 'user does not exist',
      });
    }

    if (custo.password !== body.password) {
      return res.status(404).json({
        status: 404,
        error: 'invalid password',
      });
    }

    return res.status(200).json({
      status: 200,
      data: [{
        token: 'ahd64jfhHG7832KFM5',
      },]
    });
  }

}
export default UsersController;

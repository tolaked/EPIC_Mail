import dotenv from 'dotenv';
import { Pool } from pg;

dotenv.config();
let connectionString;

if(procees.env.NODE_ENV === 'test') {
  connectionString = process.env.TEST;
}
if(process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_URL;
}

const pool = new Pool({
  connectionString,
});

class Db {
  /**
   * 
   * @param {*} queryString 
   * @param {*} params 
   */
  static query(queryString, params) {
    return new Promise((resolve, reject) =>{
      pool
      .query(queryString, params)
      .then((res) => {
        resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
}

export default Db;
import dotenv from 'dotenv';
import { Pool } from pg;

dotenv.config();

let connectionString;

// Check if on test db
if(process.env.NODE_ENV === 'test') {
  connectionString = process.env.TEST;
}

// check if on production db
if(process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_URL;
}

// Instantiate pg object
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
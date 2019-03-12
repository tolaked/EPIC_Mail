import fs from 'fs';

class Helper {
  static checkIfEmpty(value) {
    let result;
    result = value === undefined
      || value === null
      || value === ''
      || (typeof value === 'object' && Object.keys(value).length === 0)
      || (typeof value === 'string' && value.trim().length === 0);

    return result;
  }

  /**
   * Save data to file
   *
   * @param {string} filePath
   * @param {object} dataFile
   * @param {objet} values
   */
  static saveData(filePath, dataFile, values) {
    // add new record to array
    const result = dataFile.unshift(values);

    // check for succesfuly added record
    if (result !== -1) {
      fs.writeFileSync(filePath, JSON.stringify(dataFile), 'utf8');
    }

    return values;
  }

  /**
   * generate a unique id for every new record
   *
   * @param {array} dataArray
   * @param {number} index
   */
  static generateId(dataArray, index) {
    return dataArray.length > 0 ? dataArray[index].id + 1 : 0;
  }

  /**
   * find a specific user by email
   *
   * @param {array} objArr
   * @param {string} userEmail
   */
  static findUserByEmail(objArr, userEmail) {
    return objArr.find(currentUser => currentUser.email === userEmail);
  }

  /**
   *
   * find message by status
   *
   * @param {array} objArr
   * @param {string} status
   */
  static findMessage(objArr, status) {
    return objArr.filter(currentMessage => currentMessage.status === status);
  }

  /**
   *
   * find message by id
   *
   * @param {array} objArr
   * @param {number} messageId
   */
  static findMessageById(objArr, messageId) {
    return objArr.filter(currentMessage => currentMessage.id === messageId);
  }

  /**
   * filter message by id
   *
   * @param {object} objArr
   * @param {number} messageId
   */
  static filterMessage(objArr, messageId) {
    return objArr.filter(currentMessage => currentMessage.id !== messageId);
  }
}

export default Helper;

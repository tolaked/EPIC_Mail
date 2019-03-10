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

  // To save data into file
  static saveData(filePath, dataFile, values) {
    const result = dataFile.unshift(values);

    if (result !== -1) {
      fs.writeFile(filePath, JSON.stringify(dataFile), 'utf8', (error) => {
        if (error) {
          console.log(`file can not be found:${error}`);
        }
      });
    }
    return values;
  }

  // generate unique id
  static generateId(dataArray, index) {
    return dataArray.length > 0 ? dataArray[index].id + 1 : 0;
  }

  // find a specific user by their email
  static findUserByEmail(objArr, userEmail) {
    return objArr.find(element => element.email === userEmail);
  }

  // find a message by status
  static findMessage(objArr, status) {
    return objArr.filter(el => el.status === status);
  }

  // find a message by id
  static findMessageById(objArr, messageId) {
    return objArr.filter(el => el.id === messageId);
  }

  // filter a message by id
  static filterMessage(objArr, messageId) {
    return objArr.filter(el => el.id !== messageId);
  }
}

export default Helper;

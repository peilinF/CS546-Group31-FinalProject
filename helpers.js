//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const parkNameList = require('./constant').parkNameList;
const fs = require('fs');


function validDate(date) {
  if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) throw 'Date must be in the format YYYY-MM-DD';

  let parts = date.split("-");
  let day = parseInt(parts[2], 10);
  let month = parseInt(parts[1], 10);
  let year = parseInt(parts[0], 10);
  

  if (year < 1900 || month == 0 || month > 12) throw 'Invalid date';

  let daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) throw 'Invalid date';

  return true;
}



function validEmailAddr(email) {
  if (typeof email !== 'string') throw 'Email must be a string';
  if (email.trim().length === 0)
    throw 'Email cannot be an empty string or just spaces';
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) throw 'Email address is not valid';
  return true;
}


function validUserName(name) {
  if (!name) throw 'You must provide an user name to search for';
  if (typeof name !== 'string') throw 'User name must be a string';
  if (name.trim().length === 0)
    throw 'User name cannot be an empty string or just spaces';
  let nameValidFlag = false;
  let counter = 0;
  for (let i = 0; i < name.length; i++) {
    var ch = name.charAt(i);
    if (!/[a-zA-Z]/g.test(ch) && isNaN(ch)) {
      nameValidFlag = true;
      break;
    } else {
      counter += 1;
    }
  }
  if (counter < 4) {
    throw 'User name is too short. User name should be at least 4 characters long.'
  }
  if (nameValidFlag) {
    throw 'UserName-No empty spaces, no spaces in the username and only alphanumeric characters are allowed.'
  }
  return name
}

function validParkId(parkId) {
  if (!parkId) throw 'You must provide an id to search for'
  if (parkId.trim().length === 0)
    throw 'id cannot be an empty string or just spaces'
  parkId = parkId.trim()
  return parkId
}

function isValidObjectId(objectId) {
  if (!objectId) throw 'You must provide an id to search for';
  if (typeof objectId !== 'string' && typeof objectId !== 'object')
    throw `Id ${objectId} must be a string or ObjectId`;
  if (typeof objectId === 'string') {
    if (!ObjectId.isValid(objectId)) throw `Id ${objectId} is not a valid User idObjectId`;
  }
  if (objectId.trim().length === 0)
    throw 'id cannot be an empty string or just spaces';
  objectId = objectId.trim();
  return objectId
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 16);
}

function checkPasswordString(password) {
  if (typeof password != "string") {
    throw 'password should be valid string.'
  }
  if (password.trim().length === 0) {
    throw 'password should not be all empty spaces.'
  }
}

function checkPassword(password) {
  //The constraints for password will be: There needs to be at least one uppercase character,
  //there needs to be at least one lowercase character, 
  //there has to be at least one number and there has to be at least one special character,
  //at least 8 characters long
  //var regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/g;
  for (let i = 0; i < password.length; i++) {
    if (password.charAt(i) === " ") {
      throw 'No spaces between password.'
    }
  }

  let strongPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
  if (!strongPassword.test(password)) {
    throw 'Not valid password-At least one upper case character,at least one lower character,at least one number,at least one special character,at least 8 characters.'
  }
}

function checkParkName(parkName) {
  if (!parkName) throw 'You must provide an user name to search for';
  if (typeof parkName !== 'string') throw 'User name must be a string';
  if (parkName.trim().length === 0)
    throw 'park name cannot be an empty string or just spaces';
}

function checkReviewID(reviewId) {
  if (!reviewId) throw 'You must provide an id to search for';
  if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof reviewId === 'string') {
    if (!ObjectId.isValid(reviewId)) throw 'Id is not a valid ObjectId';
  }
  if (reviewId.trim().length === 0)
    throw 'id cannot be an empty string or just spaces';
}

function checkparamsUpdateUser(userId, userName, email, birthDate, hashedPassword) {
  if (!hashedPassword) throw 'User must have password'
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim(); 
  userName = validUserName(userName)
  if (!email) throw 'You must provide an email';
  if (typeof email !== 'string') throw 'Email must be a string';
  if (email.trim().length === 0)
    throw 'Email cannot be an empty string or just spaces';
  email = email.trim();
  if (!validEmailAddr(email)) throw 'Email is not valid';
  if (!birthDate) throw 'You must provide a birth date';
  validDate(birthDate)
}

function changeParkName(parkName) {
  for (let i = 0; i < parkNameList.length; i++) {
    if (parkNameList[i].includes(parkName)) {
      return parkNameList[i];
    }
  }
}

function image() {
  let rawdata = fs.readFileSync("image.json");
  let images = JSON.parse(rawdata);
  return images;
}

module.exports = {
  validDate,
  validEmailAddr,
  validUserName,
  validParkId,
  isValidObjectId,
  hashPassword,
  checkPassword,
  checkPasswordString,
  checkParkName,
  checkReviewID,
  checkparamsUpdateUser,
  changeParkName,
  image
}

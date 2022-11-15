const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const createUser = async (
  userName,
  email,
  birthDate,
  hashedPassword
) => {
  
  let reviews = [];
  let comments = [];
  let parksHaveVisited = [];
  let parksWishToGo = [];
  let likes = [];

  if (!userName) throw 'You must provide a user name';
  if (typeof userName !== 'string') throw 'User name must be a string';
  if (userName.trim().length === 0)
    throw 'User name cannot be an empty string or just spaces';
  userName = userName.trim();
  
  if (!email) throw 'You must provide an email';
  if (typeof email !== 'string') throw 'Email must be a string';
  if (email.trim().length === 0)
    throw 'Email cannot be an empty string or just spaces';
  email = email.trim();
  if (!helper.vaildEmailAddr(email)) throw 'Email is not valid';

  if (!birthDate) throw 'You must provide a birth date';
  if (typeof birthDate !== 'string') throw 'Birth date must be a string';
  if (birthDate.trim().length === 0)
    throw 'Birth date cannot be an empty string or just spaces';
  birthDate = birthDate.trim();
  if (!helper.validDate(birthDate)) throw 'Birth date is not valid';

  const newUser = {
    userName: userName,
    email: email,
    birthDate: birthDate,
    hashedPassword: hashedPassword,
    reviews: reviews,
    comments: comments,
    parksHaveVisited: parksHaveVisited,
    parksWishToGo: parksWishToGo,
    likes: likes,
  };
  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) return false;
  return true;
};

const getAllUsers = async () => {
  const usersCollection = await users();
  const userList = await usersCollection.find({}).toArray();
  for (let i = 0; i < userList.length; i++) {
    userList[i]._id = userList[i]._id.toString();
  }
  if (!userList) movieList = [];
  return userList;
};

const getUserById = async (userId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(movieId) });
  if (!user) throw 'Movie not found';
  user._id = user._id.toString();
  return user;
};

const removeUsers = async (userId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({ _id: ObjectId(userId) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${userId}`;
  }
  
  return userId;
};

const updateUser = async (
  userId,
  userName,
  email,
  birthDate,
  hashedPassword
) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim(); 
  if (!userName) throw 'You must provide a user name';
  if (typeof userName !== 'string') throw 'User name must be a string';
  if (userName.trim().length === 0)
    throw 'User name cannot be an empty string or just spaces';
  userName = userName.trim();
  
  if (!email) throw 'You must provide an email';
  if (typeof email !== 'string') throw 'Email must be a string';
  if (email.trim().length === 0)
    throw 'Email cannot be an empty string or just spaces';
  email = email.trim();
  if (!helper.validateEmail(email)) throw 'Email is not valid';

  if (!birthDate) throw 'You must provide a birth date';
  if (typeof birthDate !== 'string') throw 'Birth date must be a string';
  if (birthDate.trim().length === 0)
    throw 'Birth date cannot be an empty string or just spaces';
  birthDate = birthDate.trim();
  if (!helper.validDate(birthDate)) throw 'Birth date is not valid';

  const update = {

    userName: userName,
    email: email,
    birthDate: birthDate,
    hashedPassword: hashedPassword,
  };

  const userCollection = await users();
  const updatedUser = {
    $set: update,
  };
  const query = {
    _id: ObjectId(userId),
  };

  const updateInfo = await userCollection.updateOne(query, updatedUser);
  if(updateInfo.modifiedCount === 0) {
    throw 'could not update movie successfully';
  }
  return await getUserById(userId);


};



module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  removeUsers,
  updateUser,
};

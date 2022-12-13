const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const bcrypt = require("bcryptjs");
const { helpers } = require('handlebars');
const createUser = async (
  userName,
  email,
  birthDate,
  Password,
  question1,
  answer1,
  question2,
  answer2
) => {
  
  let reviews = [];
  let comments = [];
  let parksHaveVisited = [];
  let parksWishToGo = [];
  let likes = [];
  let followers = [];

  //check UserName
  if (!userName) throw 'You must provide a user name';
  helper.validUserName(userName);
  userName = userName.trim();
  
  if (!email) throw 'You must provide an email';
  if (typeof email !== 'string') throw 'Email must be a string';
  if (email.trim().length === 0)
    throw 'Email cannot be an empty string or just spaces';
  email = email.trim();
  if (!helper.validEmailAddr(email)) throw 'Email is not valid';

  if (!birthDate) throw 'You must provide a birth date';
  // if (typeof birthDate !== 'string') throw 'Birth date must be a string';
  // if (birthDate.trim().length === 0)
  //   throw 'Birth date cannot be an empty string or just spaces';
  // birthDate = birthDate.trim();
  if(!Password) throw 'You must provide password!';
   //check email
   helper.validEmailAddr(email);
   //check password
   helper.checkPasswordString(Password);
   helper.checkPassword(Password);

   Password = helper.hashPassword(Password);

  if(!question1) throw '1-You must select secure questions!';
  if(!answer1) throw '1-You must answer question!';
  if(answer1.trim().length === 0) throw "Answer cannot be an empty string or just spaces";
  answer1 = answer1.trim();

  if(!question2) throw '2-You must select secure questions!';
  if(!answer2) throw '2-You must answer question!';
  if(answer2.trim().length === 0) throw "Answer cannot be an empty string or just spaces";
  answer2 = answer2.trim();

  let likesReceivedAmount = 0;
  const newUser = {
    userName: userName,
    email: email.toLowerCase(),
    birthDate: birthDate,
    Password: Password,
    question1:question1,
    answer1:answer1,
    question2:question2,
    answer2:answer2,
    reviews: reviews,
    comments: comments,
    followers: followers,
    parksHaveVisited: parksHaveVisited,
    parksWishToGo: parksWishToGo,
    likes: likes,
    likesReceivedAmount: likesReceivedAmount,
  };
  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw 'Could not add user';
  //return await getUserById(insertInfo.insertedId.toString());
  return {userInserted: true, userId: insertInfo.insertedId.toString()};
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
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid User idObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!user) throw 'Movie not found';
  user._id = user._id.toString();
  return user;
};
const getUserByName = async (name) => {
  if (!name) throw 'You must provide an user name to search for';
  if (typeof name !== 'string') throw 'User name must be a string';
  if (name.trim().length === 0)
      throw 'User name cannot be an empty string or just spaces';
  name = name.trim();
  const userCollection = await users();
  const user = await userCollection.findOne({ userName: name });
  if (!user) return false;
  user._id = user._id.toString();
  return user;
};
const removeUser = async (userId) => {
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

const getUserByEmail = async (email) => {
  if (!email) throw 'You must provide an user name to search for';
  if (typeof email !== 'string') throw 'User name must be a string';
  if (email.trim().length === 0)
      throw 'User name cannot be an empty string or just spaces';
  email = email.trim();
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email.toLowerCase() });
  if (!user) return false;
  user._id = user._id.toString();
  return user;
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
  if (!helper.validEmailAddr(email)) throw 'Email is not valid';

  if (!birthDate) throw 'You must provide a birth date';
  // if (typeof birthDate !== 'string') throw 'Birth date must be a string';
  // if (birthDate.trim().length === 0)
  //   throw 'Birth date cannot be an empty string or just spaces';
  // birthDate = birthDate.trim();
  // if (!helper.validDate(birthDate)) throw 'Birth date is not valid';

  const update = {

    userName: userName,
    email: email.toLowerCase(),
    birthDate: birthDate,
    Password: hashedPassword
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

const checkUser = async (email, password) => {
  if(!email || !password){
    throw 'All fields need to have valid values.'
  }

  //check email
  helper.validEmailAddr(email);
  //check password
  helper.checkPasswordString(password);
  helper.checkPassword(password);

  //Query the db for the username supplied, if it is not found, throw an error
  const usersCollection = await users();
  const user = await usersCollection.findOne({email: email.toLowerCase()});
  if(user === null) throw 'email is not sign up'
  const compareToPassword = await bcrypt.compare(password,user.Password);
  if(compareToPassword){
    return {authenticatedUser: true, userName: user.userName};
  }else{
    throw 'Either the username or password is invalid.'
  }
};

const forgetPassword = async (email, password, question1, answer1, question2, answer2) => {
  if(!email) throw "Please enter your register email!";
  if(!password) throw "Please enter password!";
  if (email.trim().length === 0)
      throw 'User name cannot be an empty string or just spaces';
  if (typeof email !== 'string') throw 'User name must be a string';
   //check email
  helper.validEmailAddr(email);
  email = email.trim();
  //check password
  if(!password) throw 'You must provide password!';
  helper.checkPasswordString(password);
  helper.checkPassword(password);
  

  const user = await getUserByEmail(email);
  // if(user === 'false') throw "No user with that email!";

  if(!question1) throw "You must select secure questions!";
  if(!answer1) throw "Please enter you answer!";
  if(answer1.trim().length === 0) throw "Answer cannot be an empty string or just spaces";
  answer1 = answer1.trim();

  if(!question2) throw 'You must select secure questions!';
  if(!answer2) throw 'Please enter you answer!';
  if(answer2.trim().length === 0) throw "Answer cannot be an empty string or just spaces";
  answer2 = answer2.trim();

  if(question1 !== user.question1) throw "Either questions or answers are wrong!";
  if(answer1 !== user.answer1) throw "Either questions or answers are wrong!";

  if(question2 !== user.question2) throw "Either questions or answers are wrong!";
  if(answer2 !== user.answer2) throw "Either questions or answers are wrong!";

  password = helper.hashPassword(password);
  const update = {
    Password: password,
  };

  const userCollection = await users();
  const updateData = await userCollection.updateOne(
    {email: user.email},
    {$set: update}
  );

  if (updateData.modifiedCount === 0) {
    throw 'could not update password successfully';
  }
  
  console.log("yes");
  return {passwordChanged: true};
};

const addReview = async (userId, reviewId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!reviewId) throw 'You must provide an id to search for';
  if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof reviewId === 'string') {
    if (!ObjectId.isValid(reviewId)) throw 'Id is not a valid ObjectId';
  }
  if (reviewId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  reviewId = reviewId.trim();

  const userCollection = await users();
  const updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $push: { reviews: reviewId } });

};

const removeReview = async (userId, reviewId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!reviewId) throw 'You must provide an id to search for';
  if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof reviewId === 'string') {
    if (!ObjectId.isValid(reviewId)) throw 'Id is not a valid ObjectId';
  }
  if (reviewId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  reviewId = reviewId.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  let updatedUser = 0;
  let userReview = user.reviews;
  if ( userReview.length === 1){
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pop: { reviews: -1 } });
  } else {
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pull: { reviews: reviewId } });
  }
  if (updatedUser.modifiedCount === 0) {
    throw 'could not remove review successfully';
  }

};
const addComment = async (userId, commentId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  } 
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!commentId) throw 'You must provide an id to search for';
  if (typeof commentId !== 'string' && typeof commentId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof commentId === 'string') {
    if (!ObjectId.isValid(commentId)) throw 'Id is not a valid ObjectId';
  }
  if (commentId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  commentId = commentId.trim();

  const userCollection = await users();
  const updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $push: { comments: commentId } });
};

const removeComment = async (userId, commentId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!commentId) throw 'You must provide an id to search for'; 
  if (typeof commentId !== 'string' && typeof commentId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof commentId === 'string') {
    if (!ObjectId.isValid(commentId)) throw 'Id is not a valid ObjectId';
  }
  if (commentId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  commentId = commentId.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  let updatedUser = 0;
  let userComment = user.comments;
  if ( userComment.length === 1){
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pop: { comments: -1 } });
  } else {
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pull: { comments: commentId } });
  }
  if (updatedUser.modifiedCount === 0) {
    throw 'could not remove comment successfully';
  } 
};

const addParksWishToGO = async (userId, parkId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  parkId = parkId.trim();

  const userCollection = await users();
  const updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $push: { parksWishToGo: parkId } });
  if (updatedUser.modifiedCount === 0) {
    throw 'could not add park successfully';
  }
};



const removeParksWishToGO = async (userId, parkId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  parkId = parkId.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  let updatedUser = 0;
  let userPark = user.parksWishToGo;
  if ( userPark.length === 1){
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pop: { parksWishToGo: -1 } });
  } else {
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pull: { parksWishToGo: parkId } });
  }
  if (updatedUser.modifiedCount === 0) {
    throw 'could not remove park successfully';
  }

};

const addParksHaveVisited = async (userId, parkId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  parkId = parkId.trim();

  const userCollection = await users();
  const updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $push: { parksHaveVisited: parkId } });
  if (updatedUser.modifiedCount === 0) {
    throw 'could not add park successfully';
  }
};

const removeParksHaveVisited = async (userId, parkId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  parkId = parkId.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  let updatedUser = 0;
  let userPark = user.parksWishToGo;
  if ( userPark.length === 1){
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pop: { parksHaveVisited: -1 } });
  } else {
    updatedUser =await userCollection.updateOne( {_id: ObjectId(userId)},{ $pull: { parksHaveVisited: parkId } });
  }
  if (updatedUser.modifiedCount === 0) {
    throw 'could not remove park successfully';
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  removeUser,
  getUserByEmail,
  updateUser,
  getUserByName,
  checkUser,
  forgetPassword,
  addReview,
  removeReview,
  addComment,
  removeComment,
  addParksWishToGO,
  removeParksWishToGO,
  addParksHaveVisited,
  removeParksHaveVisited
};

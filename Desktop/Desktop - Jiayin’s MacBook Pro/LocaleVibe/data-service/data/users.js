import { users } from "../config/mongoCollections.js";
import validation from "../validation/postValidation.js";
import postData from "./posts.js";
import { ObjectId } from "mongodb";

const validateEmail = (email) => {
  if (!email) throw 'You must provide a user email to search for';
  if (typeof email !== 'string') throw 'User email must be a string';
  if (email.trim().length === 0) throw 'User email cannot be an empty string or just spaces';
  return email.trim().toLowerCase();
};

const validateId = (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string' && typeof id !== 'object') throw 'Id must be a string or ObjectId';
  if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  return id.trim();
};

export const createUser = async (name, email, _id) => {
  const userCollection = await users();
  let usernameDuplication = await userCollection.findOne({
    email: email,
  });
  if (usernameDuplication !== null) throw "Username already exists";
  const newUser = {
    _id: _id,
    name: name,
    email: email.toLowerCase(),
    imageURL: "",
    posts: [],
    events: []
  };
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (newInsertInformation.acknowledged != true) throw "Insert failed!";
  return await getUserById(newInsertInformation.insertedId);
};

export const getUserById = async (id) => {
  try {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  email = validateEmail(email);
  try {
      const userCollection = await users();
      const user = await userCollection.findOne({ email: email.toLowerCase()});
      return user;
  } catch (error) {
      throw error;
  }
};

export const updateUserPatch = async (id,userInfo) => {
  id = validateId(id);
  if(userInfo.name){
    if(typeof userInfo.name !== 'string') throw 'Name must be a string';
    if (userInfo.name.trim().length === 0)
      throw 'Name cannot be an empty string or just spaces';
    userInfo.name = userInfo.name.trim();
  }
  if(userInfo.email){
    userInfo.email = validateEmail(userInfo.email);
  }
  if(userInfo.posts){
    if(!Array.isArray(userInfo.posts)) throw 'Posts must be an array';
  }
  if(userInfo.events){
    if(!Array.isArray(userInfo.events)) throw 'Events must be an array';
  }

  const oldUserInfo = await getUserById(id);
  console.log("Old User Info:", oldUserInfo);  // 日志输出旧的用户信息
  
  const isimagechanged = userInfo.imageURL !== undefined && userInfo.imageURL !== oldUserInfo.imageURL;

  const isNameChanged = userInfo.name !== undefined && userInfo.name !== oldUserInfo.name;
  console.log("Is Name Changed:", isNameChanged);  // 日志输出是否更改了用户名

  try {
    const userCollection = await users();
    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: id},
      { $set: userInfo },
      {returnDocument: 'after'}
      );
    if (!updatedInfo)
      throw `Error: Update failed, could not find a user with id of ${id}`;
    console.log("Updated User Info:", updatedInfo); 
    const updatedPosts = [];
    if (isNameChanged) {
      console.log("Updating Posts...");
      for (const postId of oldUserInfo.posts) {
        const postIdstr = postId.toString();
        console.log("post id:", postIdstr);
        const updatedPost = await postData.updateUserNameInPostById(postIdstr, userInfo.name);
        updatedPosts.push(updatedPost);
      }
    }
    if (isimagechanged) {
      for (const postId of oldUserInfo.posts) {
        const postIdstr = postId.toString();
        const updatedPost = await postData.updateUserImageInPostById(postIdstr, userInfo.imageURL);
        updatedPosts.push(updatedPost);
      }
    }
    // return updatedInfo;
    console.log("Updated Posts:", updatedPosts); 
    return { updatedUserInfo: updatedInfo, updatedPosts };
  } catch (error) {
    console.error("Error in updateUserPatch:", error);
    throw error;
  }
};

export const addPostToUser = async (userId, postId) => {
  userId = validateId(userId);
  postId = validateId(postId);
  try {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne({_id: userId}, { $push: { posts: postId } });
    if (!updatedInfo)
      throw `Error: Update failed, could not find a user with id of ${userId}`;
    return updatedInfo;
  }catch (error) {
    throw error;
  }
};

export const addEventToUser = async (userId, eventId) => {
  userId = validateId(userId);
  eventId = validateId(eventId);
  
  try {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne({_id: userId}, { $push: { events: eventId } });
    if (!updatedInfo)
      throw `Error: Update failed, could not find a user with id of ${userId}`;
    return updatedInfo;
  }catch (error) {
    throw error;
  }
};

export const removeEventFromUser = async (userId, eventId) => {
  userId = validateId(userId);
  eventId = validateId(eventId);
  
  const userCollection = await users();
  const user = await getUserById(userId);
  if (!user) throw "User not found";
  let userEvents = user.events;
  let updateEvents = 0;
  if(userEvents. length === 1 && userEvents[0] === eventId){
    updateEvents = await userCollection.updateOne({_id: userId}, { $pop: { events: -1 } });
  } else{
    updateEvents = await userCollection.updateOne({_id: userId}, { $pull: { events: eventId } });
  }
  if(updateEvents.modifiedCount === 0) throw "Could not remove event from user";
};
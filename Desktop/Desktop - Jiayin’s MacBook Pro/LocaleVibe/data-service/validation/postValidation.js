import { ObjectId } from "mongodb";

const maxNameLength = 25;
const minNameLength = 1;
const maxTitleLength = 50;
const minTitleLength = 5;
const maxTextLength = 400;
const minTextLength = 5;

const checkString = (str) => {
  if (!str) throw "Please provide a string";
  if (typeof str != "string") throw "input type should be a string";
  str = str.trim();
  if (str.length === 0) throw "input should not be empty";
  return str;
};

const checkUsername = (username) => {
  if (!username) throw "Please provide a username";
  if (typeof username != "string") throw "username type should be string";
  //username = username.trim().toLowerCase();
  if (username.length < minNameLength)
    throw `username length should be at least ${minNameLength} character`;
  if (username.length > maxNameLength)
    throw `username length should be less than ${maxNameLength} character`;
  // check if string contains space
  //const space = /\s/;
  //if (space.test(username) == true) throw "username should not contains space";

  return username;
};

const checkFirstname = (username) => {
  if (!username) throw "Please provide a username";
  if (typeof username != "string") throw "username type should be string";
  username = username.trim().toLowerCase();
  if (username.length < minNameLength)
    throw `username length should be at least ${minNameLength} character`;
  if (username.length > maxNameLength)
    throw `username length should be less than ${maxNameLength} character`;
  // check if string contains space
  const space = /\s/;
  if (space.test(username) == true) throw "username should not contains space";

  return username;
};

const checkLastname = checkFirstname;

const checkStringObjectID = (id) => {
  if (!id) throw `Error: You must provide a id`;
  if (typeof id !== "string") throw `Error:id must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: id cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: id invalid object ID`;
  return id;
};

const checkTitle = (title) => {
  if (!title) throw "Please provide a title";
  if (typeof title != "string") throw "title type should be string";
  title = title.trim();
  if (title.length < minTitleLength)
    throw `title length should be at least ${minTitleLength} character`;
  if (title.length > maxTitleLength)
    throw `title length should be less than ${maxTitleLength} character`;
  return title;
};

const checkText = (text) => {
  if (!text) throw "Please provide a text";
  if (typeof text != "string") throw "text type should be string";
  text = text.trim();
  if (text.length < minTextLength)
    throw `text length should be at least ${minTextLength} character`;
  if (text.length > maxTextLength)
    throw `text length should be less than ${maxTextLength} character`;
  return text;
};

export default {
  checkString,
  checkUsername,
  //checkFirstname,
  //checkLastname,
  checkStringObjectID,
  checkTitle,
  checkText,
};

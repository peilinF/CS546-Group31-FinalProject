const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const path = require('path');
const helpers = require('../helpers');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/user.html'));

});

router.route("/search").post(async (req, res) => {
  //code here for POST
  let name = re.body.searchUserNameInputText
  try {
    name = helpers.validUserName(name)
  } catch(e) {
    res.render('error', {path: '/user/search', statucode: 400, error : e});
    res.status(400);
    return;
  }
  try {
    const user = await userData.getUserByName(name);
    res.render('profile', {user: user});
    res.status(200)
    return
  } catch (e) {
    if (e === "No user found") {
      res.render('error', {path: '/user/search', statucode: 404, error : e});
      res.status(404);
      return;
    } else {
      res.render('error', {path: '/user/search', statucode: 500, error : e});
      res.status(500);
      return;
    }
  }
});


router.route("/id/:id").get(async (req, res) => {
  //code here for GET
  let userId = req.params.id;
  try {
    userId = helpers.isValidObjectId(userId)
  } catch(e) {
    res.render('error', {path: '/user/id', statucode: 400, error : e});
    res.status(400);
    return;
  }
  try {
    const user = await userData.getUserById(userId);
    res.render('profile', user);
    res.status(200)
  } catch (e) {
    if (e === "No person found") {
      res.render('error', {path: '/user/id', statucode: 404, error : e});
      res.status(404);
      return;
  } else {
    res.render('error', {path: '/user/id', statucode: 500, error : e});
    res.status(500);
    return;
  }
}
});

router.route("/test").get(async (req, res) => {
  //code here for GET
  const user = {
    "userID" : "507f1f77bcf86cd799439011",
    "userName" : "Alexia Dua",
    "email" : "Alexia@gmail.com",
    "birthDate" : "05/06/2000",
    "harshPassword" : "$2a$08$XdvNkNIL8F8xsuIUeSbNOF",
    "reviews" : ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    "comments" : ["607f1f77bcf86cd998739013"],
    "ParksHaveVisited" : ["7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310","507f1f77bcf86cd799439011"],
    "ParksWishToGo" : ["7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311","7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311"],
    "likes" : ["507f1f77bcf86cd799439013","507f1f77bcf86cd799439012","603d992b919a503b9afb856e"]
  }
  res.render('profile', {user: user});
  res.status(200)
  return
  }
);
module.exports = router;
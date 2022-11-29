const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const path = require('path');
const helpers = require('../helpers');
const test = require('../test')

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/user.html'));

});

router.route("/search").post(async (req, res) => {
  //code here for POST
  let name = req.body.searchUserNameInputText
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
  const user = test.DUMMY_USER
  res.render('profile', {user: user});
  res.status(200)
  return
  }
);
module.exports = router;
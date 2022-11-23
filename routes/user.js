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

router.route("/user/search").post(async (req, res) => {
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
    res.render('profile', {user: user, vistedParks: [], wishedParks: []});
    res.status(200)
    return
  } catch (e) {
    if (e === "No user found") {
      res.render('personNotFound', {hasError:true, searchPersonName: name});
      res.status(404);
      return;
    } else {
      res.render('error', {path: '/user/search', statucode: 500, error : e});
      res.status(500);
      return;
    }
  }
});


router.route("/user/:id").get(async (req, res) => {
  //code here for GET
  let id = req.params.id;
  try {
    const person = await userData.searchuserByID(id);
    res.render('personFoundByID', person);
  } catch (e) {
    if (e === "No person found") {
      res.render('error', {class:"persondetails",error : `No person found with id: ${id}`});
      res.status(404);
      return;
  } else {
    res.render('error', {class:"persondetails",error : e});
    res.status(400);
    return;
  }
}
});
module.exports = router;
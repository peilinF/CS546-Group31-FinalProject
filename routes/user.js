const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const path = require('path');
const xss = require('xss');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/user.html'));

});

router.route("/search/name").get(async (req, res) => {
  const userName = xss(req.query.searchUserName);
  try {
    const user = await userData.getUserByName(userName);
    res.render('userFound', user);
  } catch (e) {
    if (e === "No user found") {
      res.render('personNotFound', {hasError:true, searchPersonName: name});
      res.status(404);
      return;
    } else {
      res.render('error', {class: "searchuser",error : e});
      res.status(400);
      return;
    }
  }
});

router.route("search/email").get(async (req, res) => {
  const userEmail = xss(req.query.searchUserEmail)
  try {
    const user = await userData.getUserByEmail(userEmail)
    res.render('profile', { user: user })
    res.status(200)
    return;
  } catch (e) {
    if (e === "User not found") {
      res.render('error', {path: 'user/search/email', statucode: 404, error: e})
      res.status(404)
      return;
  }
  res.render('error', {path: 'user/search/email', statucode: 400, error: e})
  res.status(400)
  return;
}
})

router.route("/persondetails/:id").get(async (req, res) => {
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
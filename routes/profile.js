const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const userData = data.users;
const path = require('path');
const xss = require('xss');

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    if(req.session.user){
      const userEmail = xss(req.session.user.email)
      try {
        const user = await userData.getUserByEmail(userEmail)
        res.status(200).render('profile',{ user: user, myProfile: true, title:"Successfully authenticated!"});
      } catch (e) {
        if (e === "User not found") {
          res.status(404).render('error', {path: '/profile', statucode: 404, error: e})
          return;
        } else {
          res.status(400).render('error', {path: '/profile', statucode: 400, error: e})
        }
      }
    }else{
      error = "Error page saying that the user is not logged in";
      res.status(401).render('../views/forbiddenAccess',{error:error, title:"Non-Authenticated!"});
      return
    }
  });

  
router.route("/update").post(async (req, res) => {
  if(!req.session.user){
    error = 'You have to login to add review!';
    res.status(400).render('userLogin',{error:error, title:"login!"});
    return;
  }
  const userId = xss(req.body.userId)
  const userName = xss(req.body.userName)
  const userEmail = xss(req.body.email)
  const userBirthDate = xss(req.body.birthDate)
  const hashedPassword = xss(req.body.hashedPassword)

  const user = await userData.getUserByEmail(userEmail)
  if (userName == user.userName && userEmail == user.email && userBirthDate == user.birthDate) {
    console.log()
    res.redirect('/profile')
    return;
  }
  try {
    updatedUser = await userData.updateUser(userId, userName, userEmail, userBirthDate, hashedPassword)
    res.status(200).render('profile', {user: updatedUser, myProfile: true})
    return;
  } catch (e) {
    res.status(500).render('error', {path: 'user/update', statuscode: 500, error: e})
    return;
  }
})

  module.exports = router;
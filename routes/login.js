const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const usersData = data.users;
const path = require('path');
const xss = require('xss');

router
.route("/")
.get(async (req, res) => {
  //code here for GET
  res.render('userLogin');
})
.post(async (req, res) => {
  //code here for POST
  const email = xss(req.body.emailInput);
  const passWord = xss(req.body.passwordInput);
  if(!email || !passWord){
    error = 'All fields need to have valid values';
    res.status(400).render('userLogin',{error:error, title:"Welcome to login!"});
    return;
  }

  req.session.pageBefore = req.session.pageNow ;
  try{
    const checkUser = await usersData.checkUser(email,passWord);
    //console.log('Yea');
    // if not matched, back to login with error message
    if (checkUser.authenticatedUser) {
      req.session.user = {userName: checkUser.userName,  email: email};
      if (req.session.pageBefore === '/') {
        res.render('homepage',{userName: checkUser.userName});
        return;
      } else {
        req.session.pageBefore[1].login = true;
        res.render(req.session.pageBefore[0],req.session.pageBefore[1]);
        return;
      }
    }
  }catch(e){
    //error = "Either the username or password is invalid."
    res.status(400).render('userLogin',{error:e, title:"Welcome to login!"});
  }
})


router
  .route("/homepage")
  .get(async (req, res) => {
    //code here for GET
    //res.sendFile
    //console.log('homepage');
    res.render('homepage', {userName: req.session.user.userName});
  });

  module.exports = router;
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
  console.log('log in now');
  const email = xss(req.body.emailInput);
  const passWord = xss(req.body.passwordInput);
  if(!email || !passWord){
    error = 'All fields need to have valid values';
    res.status(400).render('userLogin',{error:error, title:"Welcome to login!"});
    return;
  }

  try{
    const checkUser = await usersData.checkUser(email,passWord);
    //console.log('Yea');
    // if not matched, back to login with error message
    if (checkUser.authenticatedUser) {
      req.session.user = {name : checkUser.userName,  email: email};

      res.render('homepage',{userName: checkUser.userName});
      return;
    }
  }catch(e){
    //error = "Either the username or password is invalid."
    res.status(400).render('userLogin',{error:e, title:"Welcome to login!"});
  }
})

router
.route('/homepage')
.get(async (req, res) => {
  //code here for GET
  if(req.session.user){
    res.render('homepage',{userName: req.session.user.name});
  }else{
    res.render('userLogin',{title:"Welcome to login!"});
  }
});

  module.exports = router;
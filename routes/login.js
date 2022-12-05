const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const usersData = data.users;
const path = require('path');
const xss = require('xss');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/login.html'));
});

router
  .route('/login')
  .post(async (req, res) => {
    //code here for POST
    const email = xss(req.body.emailInput);
    const passWord = xss(req.body.passwordInput);
    if(!email || !passWord){
      error = 'All fields need to have valid values';
      res.status(400).render('../views/userLogin',{error:error, title:"Welcome to login!"});
      return;
    }

    try{
      helper.validEmailAddr(email);
      helper.checkPasswordString(passWord);
      helper.checkPassword(passWord);
      //console.log("Success!")
    }catch(e){
      res.status(400).render('../views/userLogin',{error:e, title:"Welcome to login!"});
      return;
    }

    try{
      const checkUser = await usersData.checkUser(email,passWord);
      //console.log('Yea');
      // if not matched, back to login with error message
      if(JSON.stringify(checkUser) === JSON.stringify({authenticatedUser: true})){
        req.session.user = {username:userName};
        res.redirect('/profile');
      }
    }catch(e){
      //error = "Either the username or password is invalid."
      res.status(400).render('../views/userLogin',{error:e, title:"Welcome to login!"});
    }
  })

//This route will be protected your own authentication middleware to only allow valid, logged in users to see this page.
//If the user is logged in, you will make a simple view that displays the username (which you stored in the session when they logged in) 
//for the currently logged in user as well as the current date/time.
router
  .route('/profile')
  .get(async (req, res) => {
    //code here for GET
    if(req.session.user){
      res.render('../views/profile',{ user: req.session.user, title:"Successfully authenticated!"});
    }else{
      error = "Error page saying that the user is not logged in";
      res.status(401).render('../views/forbiddenAccess',{error:error, title:"Non-Authenticated!"});
    }
  })

  module.exports = router;
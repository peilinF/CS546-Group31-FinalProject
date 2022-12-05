//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const usersData = data.users;
const path = require('path');
const xss = require('xss');

//If the user is authenticated, it will redirect to /protected.
//If the user is not authenticated, this route will render a view with a sign-up form. The form will contain two inputs, one for the username and one for password. 
//Post: You must make sure that usernameInput and passwordInput are supplied in the req.body
router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/register.html'));
});

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if(req.session.user){
      res.render('../views/profile',{ user: req.session.user, title:"Successfully authenticated!"});
    }else{
      res.render('../views/userRegister',{title:"Welcome to register!"});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const userName = xss(req.body.usernameInput);
    const passWord = xss(req.body.passwordInput);
    const email = xss(req.body.emailInput);
    const birthday = xss(req.body.birthDateInput);
    if(!userName || !passWord || !email || !birthday){
      error = 'All fields need to have valid values';
      res.status(400).render('../views/userRegister',{error:error,  title:"Welcome to register!"});
      return;
    }

    try{
      helper.validUserName(userName);
      helper.validEmailAddr(email);
      helper.validTime(birthday);
      helper.checkPasswordString(passWord);
      helper.checkPassword(passWord);
    }catch(e){
      res.status(400).render('../views/userRegister',{error:e,  title:"Welcome to register!"});
      return;
    }

    try{
      const createUser = await usersData.createUser(userName,email,birthday,passWord);
      if(JSON.stringify(createUser) === JSON.stringify({userInserted: true})){
        //req.session.user = {username:userName}; //if not command, will login automatically. Go to '/', then "/protected",render user information.
        return res.redirect('/profile');
      }else{
        res.status(500).json({message: "Internal Server Error"});
      }
    }catch(e){
      res.status(400).render('../views/userRegister',{error:e, title:"Welcome to register!"});
    }
  })
 

// router
//   .route('/login')
//   .post(async (req, res) => {
//     //code here for POST
//     const email = xss(req.body.emailInput);
//     const passWord = xss(req.body.passwordInput);
//     if(!email || !passWord){
//       error = 'All fields need to have valid values';
//       res.status(400).render('../views/userLogin',{error:error, title:"Welcome to login!"});
//       return;
//     }

//     try{
//       helper.validEmailAddr(email);
//       helper.checkPasswordString(passWord);
//       helper.checkPassword(passWord);
//       //console.log("Success!")
//     }catch(e){
//       res.status(400).render('../views/userLogin',{error:e, title:"Welcome to login!"});
//       return;
//     }

//     try{
//       const checkUser = await usersData.checkUser(email,passWord);
//       //console.log('Yea');
//       // if not matched, back to login with error message
//       if(JSON.stringify(checkUser) === JSON.stringify({authenticatedUser: true})){
//         req.session.user = {username:userName};
//         res.redirect('/profile');
//       }
//     }catch(e){
//       //error = "Either the username or password is invalid."
//       res.status(400).render('../views/userLogin',{error:e, title:"Welcome to login!"});
//     }
//   })

// //This route will be protected your own authentication middleware to only allow valid, logged in users to see this page.
// //If the user is logged in, you will make a simple view that displays the username (which you stored in the session when they logged in) 
// //for the currently logged in user as well as the current date/time.
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

//This route will expire/delete the AuthCookie and inform the user that they have been logged out.
router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.render('../views/logout',{title:"Logout!"});
  });

  module.exports = router;
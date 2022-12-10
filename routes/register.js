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
router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    //res.sendFile(path.resolve('static/register.html'));
    res.render('userRegister',{
      partial: 'register'
    });
  })
  .post(async (req, res) => {
    //code here for POST
    
    const userName = xss(req.body.username);
    const passWord = xss(req.body.password);
    const email = xss(req.body.email);
    const birthday = xss(req.body.birthDate);
    const question1 = xss(req.body.questionA);
    const answer1 = xss(req.body.answer1);
    const question2 = xss(req.body.questionB);
    const answer2 = xss(req.body.answer2);
    
    if(!userName || !passWord || !email || !birthday ||!question1 ||!answer1 ||!question2 ||!answer2){
      error = 'All fields need to have valid values';
      res.status(400).render('userRegister',{partial: 'register', error:error,  title:"Welcome to register!"});
      return;
    }

    try{
      const result = await usersData.createUser(userName,email,birthday,helper.hashPassword(passWord),question1,answer1,question2,answer2);
      console.log(userName,passWord,email,birthday);
      if(result.userInserted ){
        res.redirect('/login');
        return;
      }else{
        res.status(500).json({message: "Internal Server Error"});
      }
    }catch(e){
      res.status(400).render('userRegister',{error:e, title:"Welcome to register!"});
    }
  })



// router
//   .route('/register')
//   .get(async (req, res) => {
//     //code here for GET
//     if(req.session.user){
//       res.render('profile',{ user: req.session.user, title:"Successfully authenticated!"});
//     }else{
//       res.render('userRegister',{title:"Welcome to register!"});
//     }
//   })
//   .post(async (req, res) => {
//     //code here for POST
    
//     const userName = xss(req.body.usernameInput);
//     const passWord = xss(req.body.passwordInput);
//     const email = xss(req.body.emailInput);
//     const birthday = xss(req.body.birthDateInput);
//     console.log(userName);
//     if(!userName || !passWord || !email || !birthday){
//       error = 'All fields need to have valid values';
//       res.status(400).render('../views/userRegister',{error:error,  title:"Welcome to register!"});
//       return;
//     }

//     try{
//       helper.validUserName(userName);
//       helper.validEmailAddr(email);
//       helper.validTime(birthday);
//       helper.checkPasswordString(passWord);
//       helper.checkPassword(passWord);
//     }catch(e){
//       res.status(400).render('../views/userRegister',{error:e,  title:"Welcome to register!"});
//       return;
//     }

//     try{
//       const createUser = await usersData.createUser(userName,email,birthday,passWord);
//       if(JSON.stringify(createUser) === JSON.stringify({userInserted: true})){
//         //req.session.user = {username:userName}; //if not command, will login automatically. Go to '/', then "/protected",render user information.
//         return res.redirect('/profile');
//       }else{
//         res.status(500).json({message: "Internal Server Error"});
//       }
//     }catch(e){
//       res.status(400).render('../views/userRegister',{error:e, title:"Welcome to register!"});
//     }
//   })
 
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
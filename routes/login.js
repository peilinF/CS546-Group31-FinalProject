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
  res.render('userLogin',{partial: 'login', title:"Welcome to login!"});
})
.post(async (req, res) => {
  //code here for POST
  const email = xss(req.body.email);
  const passWord = xss(req.body.password);
  if(!email || !passWord){
    error = 'All fields need to have valid values';
    return res.status(400).json({error:error, title:"Welcome to login!"});
  }

  req.session.pageBefore = req.session.pageNow ;
  try{
    const checkUser = await usersData.checkUser(email,passWord);
    // if not matched, back to login with error message
    if (checkUser.authenticatedUser) {
      req.session.user = {userName: checkUser.userName,  email: email, userId: checkUser.userId};
      if (req.session.pageBefore === '/') {
        //res.json({url: '/login/homepage'});
        return res.status(200).json({url:'/'});
      } else {
        req.session.pageBefore[1].login = true;
        //res.redirect(`/park/search?searchParkName=${req.session.pageBefore[1].park.parkName}`);
        //res.json({url: `/park/search?searchParkName=${req.session.pageBefore[1].park.parkName}`});
        return res.status(200).json({url:`/park/search?searchParkName=${req.session.pageBefore[1].park.parkName}`});
      }
    }
  }catch(e){
    //error = "Either the username or password is invalid."
    return res.status(400).json({error:e, title:"Welcome to login!"});
  }
})


router
  .route("/homepage")
  .get(async (req, res) => {
    //code here for GET
    //res.sendFile
    res.render('homepage', {userName: req.session.user.userName});
  });

  module.exports = router;
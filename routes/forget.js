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
    //res.sendFile(path.resolve('static/register.html'));
    res.render('userForget',{
      partial: 'forget'
    });
  })
  .post(async (req, res) => {
    //code here for POST
    const email = xss(req.body.email);
    const passWord = xss(req.body.password);
    const question1 = xss(req.body.questionA);
    const answer1 = xss(req.body.answer1);
    const question2 = xss(req.body.questionB);
    const answer2 = xss(req.body.answer2);
    
    if(!passWord || !email ||!question1 ||!answer1 ||!question2 ||!answer2){
      error = 'All fields need to have valid values';
      res.status(400).render('userForget',{partial: 'forget', error:error,  title:"Reset your password!"});
      return;
    }

    try{
      const result = await usersData.forgetPassword(email,helper.hashPassword(passWord),question1,answer1,question2,answer2);
      if(result.passwordChanged){
        res.redirect('/login');
        return;
      }else{
        res.status(500).json({message: "Internal Server Error"});
      }
    }catch(e){
      res.status(400).render('userForget',{partial: 'forget', error:error,  title:"Reset your password!"});
    }
  })

  module.exports = router;
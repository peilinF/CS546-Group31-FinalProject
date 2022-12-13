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
      res.status(400).render('userForget',{partial: 'forget', error1:error,  title:"Reset your password!"});
      return;
    }

    const checkExist = await usersData.getUserByEmail(email);
    if (checkExist === 'false'){
      console.log("User cannot be found");
      res.status(400).send("User cannot be found");
      return;
    }

    try{
    if (question1 !== checkExist.question1) throw "Either questions or answers are incorrect!";
    if(question2 !== checkExist.question2) throw "Either questions or answers are incorrect!";
    if(answer1 !== checkExist.answer1) throw "Either questions or answers are incorrect!";
    if(answer2 !== checkExist.answer2) throw "Either questions or answers are incorrect!";
    }catch(e){
    res.status(403).send(e);
    return;
    }

    try{
      const result = await usersData.forgetPassword(email,passWord,question1,answer1,question2,answer2);
      if(result.passwordChanged){
        res.redirect('/login');
        return;
      }else{
        res.status(500).json({message: "Internal Server Error"});
      }
    }catch(e){
      res.status(403).send(e);
      return;
    }
  });

  router
  .route('/error/:errorMessage')
  .get(async (req, res) => {
    //code here for GET
    const errorMessage =xss (req.params.errorMessage);
    res.render('userForget',{ error1:errorMessage, partial: 'forget'});
  });

  module.exports = router;
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
        res.status(200).render('profile',{ user: user, title:"Successfully authenticated!"});
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

  module.exports = router;
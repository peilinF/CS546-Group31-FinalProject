const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const usersData = data.users;
const path = require('path');
const xss = require('xss');

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
  });

  module.exports = router;
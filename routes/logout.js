const express = require('express');
const router = express.Router();
const path = require('path');
const xss = require('xss');

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.redirect('/');
  });
  
  module.exports = router;
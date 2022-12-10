const express = require('express');
const router = express.Router();
const path = require('path');
const xss = require('xss');

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.sendFile(path.resolve('static/homepage.html'));
  });
  
  module.exports = router;
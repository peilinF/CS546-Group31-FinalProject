const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const test = require('../test')

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/park.html'));
});
router.route("/test").get(async (req, res) => {
  //code here for GET
  try {
    const allparks = await test.fetchAllParks()
    res.render('parkList', {parks: allparks});
    res.status(200)    
  } catch (e) {
    res.render('error', {path: '/park/test', statucode: 500, error : e});
    res.status(500);
  }
  return
  }
);
module.exports = router;
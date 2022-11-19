const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/park.html'));
});
module.exports = router;
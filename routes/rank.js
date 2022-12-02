const express = require('express');
const router = express.Router();
const data = require('../data');
const rankData = data.rank
const path = require('path');
const reviewData = data.reviews;



router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/rank/index.html'));
});

router.route("/state").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/rank/state.html'));
});

router.route("/park").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/rank/park.html'));
});

router.route("/user").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/rank/user.html'));
});

router.route("/review").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/rank/review.html'));
});

router.route("/comment").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/rank/comment.html'));
});

router.route("/user/results").get(async (req, res) => {
  //code here for GET
  let option, itemsNum, reverse;
  try {
    option = req.params.option;
    itemsNum = req.params.itemsNum
    reverse = req.params.reverse
  } catch (e) {
    res.render('error', {path: '/rank/user/result', statuscode: 400, error : e});
    res.status(400);
    return;
  }
  try {
    const results = rankData.rankUsers(option, itemsNum, reverse)
    res.render('rankUsers', {option: option, itemsNum: itemsNum, reverse: reverse, results: results})
    res.status(200)
    return
  } catch (e) {
    res.render('error', {path: '/rank/user/result', statucode: 500, error : e});
    res.status(500);
    return;
  }
});
module.exports = router;
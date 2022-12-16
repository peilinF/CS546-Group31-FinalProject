const express = require('express');
const router = express.Router();
const data = require('../data');
const rankData = data.rank
const path = require('path');
const reviewData = data.reviews;

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

router.route("/user/results").get(async (req, res) => {
  //code here for GET
  let option, itemsNum, reverse;
  try {
    option = req.query.option;
    itemsNum = req.query.itemsNum
    reverse = req.query.reverse
  } catch (e) {
    res.status(400).render('error', {path: '/rank/user/result', statuscode: 400, error : e});
    return;
  }
  if (!itemsNum) itemsNum = 10
  try {
    const results = await rankData.rankUsers(option, itemsNum, reverse)
    res.status(200).render('rankUsers', {option: option, itemsNum: itemsNum, reverse: reverse, results: results})
    return
  } catch (e) {
    res.status(500).render('error', {path: '/rank/user/result', statuscode: 500, error : e});
    return;
  }
});

router.route("/review/results").get(async (req, res) => {
  //code here for GET
  let option, itemsNum, reverse;
  try {
    option = req.query.option;
    itemsNum = req.query.itemsNum
    reverse = req.query.reverse
  } catch (e) {
    res.render('error', {path: '/rank/review/result', statuscode: 400, error : e});
    res.status(400);
    return;
  }
  if (!itemsNum) itemsNum = 10
  try {
    const results = await rankData.rankReviews(option, itemsNum, reverse)
    res.render('rankReviews', {option: option, itemsNum: itemsNum, reverse: reverse, results: results})
    res.status(200)
    return
  } catch (e) {
    res.render('error', {path: '/rank/review/result', statucode: 500, error : e});
    res.status(500);
    return;
  }
});

router.route("/park/results").get(async (req, res) => {
  //code here for GET
  let option, reverse;
  try {
    option = req.query.option;
    reverse = req.query.reverse
  } catch (e) {
    res.render('error', {path: '/rank/park/result', statuscode: 400, error : e});
    res.status(400);
    return;
  }
  try {
    console.log(option);
    const results = await rankData.rankParks(option, reverse)
    res.render('rankParks', {option: option, reverse: reverse, results: results})
    res.status(200)
    return
  } catch (e) {
    res.render('error', {path: '/rank/park/result', statucode: 500, error : e});
    res.status(500);
    return;
  }
});
module.exports = router;
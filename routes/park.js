const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
// const test = require('../test')

const parkData = data.parks;
const userData = data.users;
const reviewData = data.reviews;
const xss = require('xss');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/park.html'));
  return;
});

router.route("/search").get(async (req, res) => {
  const parkName = xss(req.query.searchParkName);
  console.log(parkName);
  if (req.session.user) {
    req.session.login = true;
  } else {
    req.session.login = false;  
  }

  try {
    let park = await parkData.getParkByName(parkName);
    park = await getReview(park);
    req.session.pageNow = ['singlePark', {partial : 'parkSubReview', park: park, login: req.session.login}]
    res.render('singlePark', {partial : 'parkSubReview', park: park, login: req.session.login});
    return;
  } catch (e) {
    res.status(500);
    return;
  }
});
router.route('/review').get(async (req, res) => {
  let park = req.session.pageNow[1].park;
  park = await parkData.getParkByName(park.parkName);
  park = await getReview(park);
  if (req.session.user) {
    req.session.login = true;
    res.render('singlePark', {partial : 'parkSubReview', park: park, login: req.session.login});
  } else {
    req.session.login = false;
  }
});
const getReview = async (park) => {
  let hasReviews = false;
  if (park.reviews.length !== 0) {
    for (let i = 0; i < park.reviews.length; i++) {
      let review = await reviewData.getReview(park.reviews[i]);
      park.reviews[i] = review;
    }
    hasReviews = true;
  }
  park.hasReviews = hasReviews;
  return park;
};

module.exports = router;
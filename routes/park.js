const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
//const parkList = require('../constant').parkNameList;

// const test = require('../test')

const parkData = data.parks;
const userData = data.users;
const reviewData = data.reviews;
const commentData = data.comments;
const xss = require('xss');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/park.html'));
  return;
});

router.route("/search").get(async (req, res) => {
  let parkName = xss(req.query.searchParkName);
  for (let i = 0; i < parkList.length; i++) {
    if (parkList[i].includes(parkName)) {
      parkName = parkList[i];
    }
  }
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

router.route("/:id").get(async (req, res) => {
  //code here for GET
  const parkId = xss(req.params.id);
  if (req.session.user) {
    req.session.login = true;
  } else {
    req.session.login = false;  
  }

  try {
    let park = await parkData.getParkById(parkId);
    park = await getReview(park);
    req.session.pageNow = ['singlePark', {partial : 'parkSubReview', park: park, login: req.session.login}]
    res.render('singlePark', {partial : 'parkSubReview', park: park, login: req.session.login});
    return;
  } catch (e) {
    res.status(500);
    return;
  }
});
const getReview = async (park) => {
  let hasReviews = false;
  if (park.reviews.length !== 0) {
    for (let i = 0; i < park.reviews.length; i++) {
      let review = await reviewData.getReview(park.reviews[i]);
      review = await getComment(review);
      park.reviews[i] = review;
    }
    hasReviews = true;
  }
  park.hasReviews = hasReviews;
  return park;
};
const getComment = async (review) => {
  let hasComments = false;
  if (review.comments.length !== 0) {
    for (let i = 0; i < review.comments.length; i++) {
      let comment = await commentData.getCommentById(review.comments[i]);
      review.comments[i] = comment;
    } 
    hasComments = true;
  }
  review.hasComments = hasComments;
  return review;
};
module.exports = router;
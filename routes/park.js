const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const helper = require("../helpers.js");
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
  let user = null;
  if (req.session.user) {
    req.session.login = true;
    const userId = req.session.user.userId;
    user = await userData.getUserById(userId);
  } else {
    req.session.login = false;  
  }
  parkName = helper.changeParkName(parkName);
  try {
    if (!parkName) throw 'You must provide an parkName to search for';
    if (typeof parkName !== 'string') throw 'parkName must be a string';
    if (parkName.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkName = parkName.trim();
  } catch (e) {
    res.status(400).render('error',  {path: 'park/search', statuscode: 400, error: e});
  }
  // try {
    let park = await parkData.getParkByName(parkName);
    park = await getReview(park,user);
    req.session.pageNow = ['singlePark', {partial : 'parkSubReview', park: park, login: req.session.login}]
    res.status(200).render('singlePark', {partial : 'parkSubReview', park: park, login: req.session.login});
    return;
  // } catch (e) {
  //   res.status(500).render('error', {path: 'park/search', statuscode: 500, error: e});
  //   return;
  // }
});


const getReview = async (park, user) => {
  let likesArray = [];
  if (user){
    likesArray = user.likes;
  }
  let hasReviews = false;
  if (park.reviews.length !== 0) {
    for (let i = 0; i < park.reviews.length; i++) {
      let review = await reviewData.getReview(park.reviews[i]);
      review = await getComment(review);
      if (review.userId === user._id.toString()) {
        review.isOwner = true;
      } else {
        review.isOwner = false;
      }
      if (likesArray.includes(review._id.toString())) {
        review.liked = true;
      } else {
        review.liked = false;
      }
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
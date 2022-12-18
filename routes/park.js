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

  var x = 0;
  var y = 0;
  if (req.session.location) {
    x = req.session.location.x;
    y = req.session.location.y;
  }
  try {
    if (!parkName) throw 'You must provide an parkName to search for';
    if (typeof parkName !== 'string') throw 'parkName must be a string';
    if (parkName.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkName = parkName.trim();
    if (!parkName) throw 'You must provide an parkName to search for';
  } catch (e) {
    res.status(400).render('error',  {title: 'Error Page',path: 'park/search', statuscode: 400, error: e});
    return;
  }
  parkName = helper.changeParkName(parkName);
  if (!parkName) {
    res.status(404).render('error',  {title: 'Error Page',path: 'park/search', statuscode: 404, error: `'${req.query.searchParkName}' is not a National Park`});
    return;
  }
  try {
    let park = await parkData.getParkByName(parkName);
    park = await getReview(park,user);
    req.session.pageNow = ['singlePark', {partial : 'parkSubReview', park: park, login: req.session.login}]
    res.status(200).render('singlePark', {partial : 'parkSubReview', park: park, login: req.session.login, location: {x: x, y: y}});
    return;
  } catch (e) {
    res.status(500).render('error', {title: 'Error Page', path: 'park/search', statuscode: 500, error: e});
    return;
  }
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
      review = await getComment(review,user);
      if (!user) {
        review.isOwner = false;
      } else if (review.userId === user._id.toString()) {
        review.isOwner = true;
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
const getComment = async (review,user) => {
  let hasComments = false;
  if (review.comments.length !== 0) {
    for (let i = 0; i < review.comments.length; i++) {
      let comment = await commentData.getCommentById(review.comments[i]);
      if (!user) {
        comment.isReplyOwner = false;
      } else if (comment.userId === user._id.toString()) {
        comment.isReplyOwner = true;
      }
      review.comments[i] = comment;
    } 
    hasComments = true;
  }
  review.hasComments = hasComments;
  return review;
};
module.exports = router;
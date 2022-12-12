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
});
// router.route("/test").get(async (req, res) => {
//   //code here for GET
//   try {
//     const allparks = await test.fetchAllParks()
//     res.render('parkList', {parks: allparks});
//     res.status(200)    
//   } catch (e) {
//     res.render('error', {path: '/park/test', statucode: 500, error : e});
//     res.status(500);
//   }
//   return
//   }
// );

router.route("/search").get(async (req, res) => {
  const parkName = req.params.searchParkName;
  try {
    let park = await parkData.getParkById(parkName);
    park = await getReview(park);
    res.render('singlePark', {park: park});
    res.status(200)
    return;
  } catch (e) {
    res.status(500);
    return;
  }
});

const getReview = async (park) => {
  let reviews = [];
  let hasReviews = false;
  for (let i = 0; i < park.reviews.length; i++) {
    let review = await reviewData.getReview(park.reviews[i]);
    delete review._id;
    reviews.push(review);
  }
  if (reviews.length !== 0) {
    hasReviews = true;
  }
  park.reviews = reviews;
  park.hasReviews = hasReviews;
  return park;
};

module.exports = router;
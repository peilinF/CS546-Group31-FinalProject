const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const usersData = data.users;
const reviewData = data.reviews;
const commentData = data.comments;
const path = require('path');
const xss = require('xss');

router
  .route('/:parkID')
  .get(async (req, res) => {
    try{
      req.params.parkID = helper.validParkId(req.params.parkID);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      const resultReviews = await reviewData.getAllReviews(req.params.parkID);
      res.status(400).render('../views/singlePark',{error:e,  title:"Park Reviews", park:resultReviews.parkID});
    }catch(e){
      res.status(404).json({ error: 'review by park id not found' });
    }
  });

router
  .route('/:parkID/:userID')
  .get(async (req, res) => {
    try{
      req.params.userID = helper.isValidObjectId(req.params.userID);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      const userReviews = await reviewData.getAllUserReviews(userID);
      res.status(400).render('../views/singlePark',{error:e,  title:"Park Reviews", park:userReviews.userID});
    }catch(e){
      res.status(404).json({ error: 'review by user id not found' });
    }
  });

  router
  .route('/:reviewID')
  .get(async (req, res) => {
    try{
      req.params.reviewID = helper.checkReviewID(req.params.reviewID);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      const userReviews = await reviewData.getAllUserReviews(userID);
      res.status(400).render('../views/singlePark',{error:e,  title:"Park Reviews", park:userReviews.userID});
    }catch(e){
      res.status(404).json({ error: 'review by user id not found' });
    }
  });
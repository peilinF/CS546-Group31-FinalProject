const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const reviewData = data.reviews;
const commentData = data.comments;
const path = require('path');
const xss = require('xss');

router
  .route('/:parkID/:reviewID/:commentID')
  .get(async (req, res) => {
    try{
      req.params.parkID = helper.validParkId(req.params.parkID);
      req.params.reviewID = helper.checkReviewID(req.params.reviewID);
      req.params.commentID = helper.isValidObjectId(req.params.commentID);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      const resultComments = await commentData.getCommentById();
      res.status(400).render('../views/singlePark',{error:e,  title:"Park Reviews", park:resultReviews.parkID});
    }catch(e){
      res.status(404).json({ error: 'review by park id not found' });
    }
  });
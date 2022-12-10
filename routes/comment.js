const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const parkData = data.parks;
const reviewData = data.reviews;
const commentData = data.comments;
const path = require('path');
const xss = require('xss');

router
  .route('/:parkID/:reviewID')
  .get(async (req, res) => {
    try{
      req.params.parkID = helper.validParkId(req.params.parkID);
      req.params.reviewID = helper.checkReviewID(req.params.reviewID);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      const park = await parkData.getParkById(req.params.parkID);
      const resultReviews = await reviewData.getReview(req.params.reviewID);
      const resultComments = await commentData.getAllComments(req.params.reviewID);
      res.render('singlePark', {park: park});
      res.status(200)
    }catch(e){
      res.status(404).json({ error: 'review by park id not found' });
    }
  })
  .post(async (req, res) => {
    if(!req.session.user){
      error = 'You have to login to reply!';
      res.status(400).render('userLogin',{error:error, title:"login!"});
    }

    const info = xss(req.body);
    if(!info.content){
      res.status(400).json({ message: 'All fields need to have valid values' });
      return;
    }

    try{
      req.params.parkID = helper.validParkId(req.params.parkID);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      req.params.reviewID = helper.checkReviewID(req.params.reviewID);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      if(typeof info.content !== 'string') throw 'content must be a string';
      info.content = info.content.trim();
    }catch(e){
      return res.status(400).json({error: e});
    }

   try{
    const {content} = info;
    const park = await parkData.getParkById(req.params.parkID);
    const createComment = await commentData.createComment(req.params.reviewID,req.session.user._id,content);
    res.status(200).render('singlePark',{park:park, partial: 'comment', title:"Comments!"});
   }catch(e){
    res.status(400).render('singlePark',{error:e, title:"Comments!"});
   }

  });
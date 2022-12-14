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
  .route('/:reviewID')
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
  });
router
  .route('/add')
  .post(async (req, res) => {
    if(!req.session.user){
      error = 'You have to login to reply!';
      return res.status(400).json({error: error});
    }

    let parkName = xss(req.body.parkName);
    const reviewId = xss(req.body.reviewId);
    let content = xss(req.body.replyContent);
    parkName = parkName.trim();
    if (!reviewId || !content ) {
      return res.status(400).json({ error: 'You must provide data for all fields' });
    }
    try{
      if(typeof content !== 'string') throw 'content must be a string';
      content = content.trim();
    }catch(e){
      return res.status(400).json({error: e});
    }
  
    const userId = req.session.user.userId;
    try{
      await commentData.createComment(reviewId.toString(), userId.toString(), content);
      const park = await parkData.getParkByName(parkName);
      return res.status(200).json({parkId: park._id});
    }catch(e){
      return res.status(400).json({error: e});
    }

  });

router
.route('/:reviewID/:commentID')
.get( async( req,res) => {
  try{
    req.params.parkID = helper.validParkId(req.params.parkID);
    req.params.reviewID = helper.checkReviewID(req.params.reviewID);
    req.params.commentID = helper.isValidObjectId(req.params.commentID);
  }catch(e){
    return res.status(400).json({error: e});
  }

  try{
    const park = await parkData.getParkById(req.params.parkID);
    const comment = await commentData.getCommentById(req.params.commentID);
    res.status(200).render('singlePark',{park:park, partial: comment, title:"Comments!"});
  }catch(e){
    res.status(404).json({ error: 'comment by user id not found' });
  }
})
.delete(async (req, res) => {
  //code here for DELETE
  if(!req.session.user){
    error = 'You have to login to reply!';
    res.status(400).render('userLogin',{error:error, title:"login!"});
  }

  try{
    req.params.parkID = helper.validParkId(req.params.parkID);
  }catch(e){
    return res.status(400).json({error: e});
  }

  try{
    req.params.reviewID = helper.checkReviewID(req.params.reviewID);
    req.params.commentID = helper.isValidObjectId(req.params.commentID);
  }catch(e){
    return res.status(400).json({error: e});
  }
  
  try{
    await commentData.getCommentById(req.params.commentID);
  }catch(e){
    return res.status(404).json({error: 'Comment not found'});
  }

  try {
    const park = await parkData.getParkById(req.params.parkID);
    await commentData.removeComment(req.params.commentID);
    res.status(200).render('singlePark',{park:park, partial: comment, title:"Comments!"});
  } catch (e) {
    res.status(500).json({error: e});
  }
});

module.exports = router;
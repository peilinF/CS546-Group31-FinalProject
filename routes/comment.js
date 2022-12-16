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

    if (typeof reviewId !== 'string') {
      return res.status(400).json({ error: 'reviewId must be a string' });
    }
    if (reviewId.trim().length === 0) {
      return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
    }
    if (typeof parkName !== 'string') {
      return res.status(400).json({ error: 'parkName must be a string' });
    }
    if (parkName.trim().length === 0) {
      return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
    }

    parkName = parkName.trim();
    try{
      if(typeof content !== 'string') throw 'content must be a string';
      content = content.trim();
    }catch(e){
      return res.status(400).json({error: e});
    }
  
    const userId = req.session.user.userId;
    try{
      await commentData.createComment(reviewId.toString(), userId.toString(), content);
      let park = await parkData.getParkByName(parkName);
      return res.status(200).json({parkName: park.parkName});
    }catch(e){
      return res.status(400).json({error: e});
    }

  });

router
  .route('/delete')
  .delete(async (req, res) => {
    if(!req.session.user){
      error = 'You have to login to reply!';
      return res.status(400).json({error: error});
    }

    let parkName = xss(req.body.parkName);
    const commentId = xss(req.body.commentId);
    parkName = parkName.trim();

    if (typeof commentId !== 'string') {
      return res.status(400).json({ error: 'reviewId must be a string' });
    }
    if (commentId.trim().length === 0) {
      return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
    }
    if (typeof parkName !== 'string') {
      return res.status(400).json({ error: 'parkName must be a string' });
    }
    if (parkName.trim().length === 0) {
      return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
    }

    parkName = parkName.trim();

    const userId = req.session.user.userId;
    const comment = await commentData.getCommentById(commentId.toString());
    if(comment.userId.toString() !== userId.toString()){
      return res.status(400).json({error: 'You are not the author of this comment!'});
    }

    try{
      await commentData.removeComment(commentId.toString());
      let park = await parkData.getParkByName(parkName);
      return res.status(200).json({parkName: park.parkName});
    } catch(e){
      return res.status(400).json({error: e});
    }

  });


module.exports = router;
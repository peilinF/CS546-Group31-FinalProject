const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const parkData = data.parks;
const reviewData = data.reviews;
const commentData = data.comments;
const usersData = data.users;
const path = require('path');
const xss = require('xss');

router
  .route('/add')
  .post(async (req, res) => {
    if(!req.session.user){
      error = 'You have to login to reply!';
      return res.status(401).json({error: error});
    }

    let parkName = req.session.pageNow[1].park.parkName;
    const reviewId = xss(req.body.reviewId);
    let content = xss(req.body.replyContent);
    parkName = parkName.trim();

    if (!reviewId) return res.status(400).json({ error: 'You must provide an id to search for' });
    if (typeof reviewId !== 'string') {
      return res.status(400).json({ error: 'reviewId must be a string' });
    }
    if (reviewId.trim().length === 0) {
      return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
    }
    if(typeof content !== 'string') return res.status(400).json({error: 'content must be a string'});
    if(content.trim().length === 0) return res.status(400).json({error: 'content cannot be an empty string or just spaces'});
    content = content.trim();
  
  
    const userId = req.session.user.userId;
    try{
      console.log('create comment');
      const comment = await commentData.createComment(reviewId.toString(), userId.toString(), content);
      const user = await usersData.getUserById(userId);
      comment._id = comment._id.toString();
      return res.status(200).json({userName: user.userName,comment: comment});
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

    let parkName = req.session.pageNow[1].park.parkName;
    const commentId = xss(req.body.commentId);
    parkName = parkName.trim();


      if (!commentId) return res.status(400).json({ error: 'You must provide an id to search for' });
      if (typeof commentId !== 'string') {
        return res.status(400).json({ error: 'reviewId must be a string' });
      }
      if (commentId.trim().length === 0) {
        return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
      }

      if (!parkName) return res.status(400).json({ error: 'You must provide an id to search for' });

    parkName = parkName.trim();

    const userId = req.session.user.userId;
    const comment = await commentData.getCommentById(commentId);
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
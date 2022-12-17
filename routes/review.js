const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const reviewData = data.reviews;
const parksData = data.parks;
const usersData = data.users;
const path = require('path');
const xss = require('xss');
const likesClass = require('../data/likes');
router
  .route('/delete')
  .delete(async (req, res) => {
    if(!req.session.user){
      error = 'You have to login to delete review!';
      return res.status(400).json({error: error});
    }
    const reviewId = xss(req.body.reviewId);
    const userId = req.session.user.userId;
    let y = xss(req.body.y);
    req.session.location = {y: y};
    let parkName = req.session.pageNow[1].park.parkName;
    
    if (!reviewId || !userId) {
      return res.status(400).json({ error: 'You must provide review or user Id' });
    }

    if (typeof reviewId !== 'string') {
      return res.status(400).json({ error: 'reviewId must be a string' });
    }
    if (reviewId.trim().length === 0) {
      return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
    }
   
    try{
      const review = await reviewData.getReview(reviewId);
      if(review.userId.toString() !== userId.toString()){
        return res.status(400).json({error: 'You can only delete your own review!'});
      }
      await reviewData.removeReview(reviewId);
      return res.status(200).json({parkName: parkName});
    } catch(e){
      return res.status(400).json({error: e});
    }

  });
router
  .route('/add')
  .post(async (req, res) => {

    if(!req.session.user){
      error = 'You have to login to add review!';
      return res.status(400).json({error: error}); 
      
    }
    const reviewTitle = xss(req.body.reviewTitle);
    const content = xss(req.body.content);
    let rating = xss(req.body.rating);
    let y = xss(req.body.y);
    req.session.location = {y: y};
    let parkName = req.session.pageNow[1].park.parkName;
    
    if (!reviewTitle || !content || !rating || !parkName) {
      return res.status(400).json({ error: 'You must provide data for all fields' });
    }

    if (typeof parkName !== 'string') {
      return res.status(400).json({ error: 'parkName must be a string' });
    }
    if (parkName.trim().length === 0) {
      return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
    }

    // parkName = parkName.trim();
    // parkName = helper.changeParkName(parkName);
    try{
      rating = parseInt(rating);
      const park = await parksData.getParkByName(parkName);
      const user = await usersData.getUserByEmail(req.session.user.email);
      await reviewData.createReview(park._id, user._id, reviewTitle, content, rating);
     
      return res.status(200).json({parkName: parkName});
    }
    catch(e){

      return res.status(400).json({error: e});
    
    }
  });

  router.route('/edit').put(async (req, res) => {

    if (!req.session.user) {
      error = 'You have to login to like review!';
      return res.status(400).json({ error: error });
    }
    const reviewId = xss(req.body.reviewId);
    const reviewTitle = xss(req.body.reviewTitle);
    const content = xss(req.body.content);
    let rating = xss(req.body.rating);
    let parkName = req.session.pageNow[1].park.parkName;
    const userId = req.session.user.userId;
    if (!reviewId || !reviewTitle || !content || !rating || !parkName) {
      return res.status(400).json({ error: 'You must provide data for all fields' });
    }

    if (typeof parkName !== 'string') {
      return res.status(400).json({ error: 'parkName must be a string' });
    }
    if (parkName.trim().length === 0) {
      return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
    }

    parkName = parkName.trim();

    try{
      rating = parseInt(rating);
      const review = await reviewData.getReview(reviewId);
      if(review.userId.toString() !== userId.toString()){
        return res.status(400).json({error: 'You can only edit your own review!'});
      }
      await reviewData.updateReview(reviewId, reviewTitle, content, rating);
      return res.status(200).json({parkName: parkName});

    }catch(e){

    }

  });

  router
    .route('/like')
    .post(async (req, res) => {
      if(!req.session.user){
        error = 'You have to login to unlike review!';
        return res.status(400).json({error: error});
      }
      const reviewId = xss(req.body.reviewId);
      const userId = req.session.user.userId;
      let parkName = req.session.pageNow[1].park.parkName;
      if (!reviewId || !userId) {
        return res.status(400).json({ error: 'You must provide reviewId or UserId' });
      }

      if (!reviewId || !userId) {
        return res.status(400).json({ error: 'You must provide review or user Id' });
      }
  
      if (typeof reviewId !== 'string') {
        return res.status(400).json({ error: 'reviewId must be a string' });
      }
      if (reviewId.trim().length === 0) {
        return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
      }
      
      try{
        await likesClass.addLike(userId, reviewId);
        return res.status(200).json({parkName: parkName});
      } catch(e){
        return res.status(400).json(e);
      }
    });

  router
    .route('/unlike')
    .post(async (req, res) => {
      if(!req.session.user){
        error = 'You have to login to add review!';
        return res.status(400).json({error: error});
      }
      const reviewId = xss(req.body.reviewId);

      const userId = req.session.user.userId;
      let parkName = req.session.pageNow[1].park.parkName;

      if (!reviewId || !userId) {
        return res.status(400).json({ error: 'You must provide review or user Id' });
      }
  
      if (typeof reviewId !== 'string') {
        return res.status(400).json({ error: 'reviewId must be a string' });
      }
      if (reviewId.trim().length === 0) {
        return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
      }
      try{
        await likesClass.removeLike(userId, reviewId);
        return res.status(200).json({parkName: parkName});
      }
      catch(e){
        return res.status(400).json(e);
      }
    });



  module.exports = router;

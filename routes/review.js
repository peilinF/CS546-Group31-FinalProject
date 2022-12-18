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
    
    let parkName = req.session.pageNow[1].park.parkName;
    parkName = parkName.trim();

    
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
      const park = await parksData.getParkByName(parkName);
      return res.status(200).json({rating: park.overallRating});
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
    try{
      rating = parseInt(rating);
      let park = await parksData.getParkByName(parkName);
      const user = await usersData.getUserByEmail(req.session.user.email);
      const review = await reviewData.createReview(park._id, user._id, reviewTitle, content, rating);
      park = await parksData.getParkByName(parkName);
      return res.status(200).json({parkName: parkName, review: review, rating:park.overallRating
      });
    }
    catch(e){

      return res.status(400).json({error: e});
    
    }
  });

  router.route('/edit').put(async (req, res) => {

    if (!req.session.user) {
      error = 'You have to login to edit review!';
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
      let review = await reviewData.getReview(reviewId);
      if(review.userId.toString() !== userId.toString()){
        return res.status(400).json({error: 'You can only edit your own review!'});
      }
      await reviewData.updateReview(reviewId, reviewTitle, content, rating);
      await parksData.updateRating(parkName);
      const park = await parksData.getParkByName(parkName);
      review = await reviewData.getReview(reviewId);
      return res.status(200).json({review: review, rating: park.overallRating});

    }catch(e){
      return res.status(400).json({error: e});
    }

  });

  router
    .route('/like')
    .post(async (req, res) => {
      if(!req.session.user){
        error = 'You have to login to like review!';
        return res.status(400).json({error: error});
      }
      const reviewId = xss(req.body.reviewId);
      const userId = req.session.user.userId;
      let parkName = req.session.pageNow[1].park.parkName;
      if (!reviewId || !userId) {
        return res.status(400).json({ error: 'You must provide reviewId or UserId' });
      }

      if (typeof reviewId !== 'string') {
        return res.status(400).json({ error: 'reviewId must be a string' });
      }
      if (reviewId.trim().length === 0) {
        return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
      }
      
      if (typeof userId !== 'string') {
        return res.status(400).json({ error: 'userId must be a string' });
      }
      if (userId.trim().length === 0) {
        return res.status(400).json({ error: 'userId cannot be an empty string or just spaces' });
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
        error = 'You have to login to unlike!';
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

      if (typeof userId !== 'string') {
        return res.status(400).json({ error: 'userId must be a string' });
      }
      if (userId.trim().length === 0) {
        return res.status(400).json({ error: 'userId cannot be an empty string or just spaces' });
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

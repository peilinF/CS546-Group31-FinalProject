const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const users = mongoCollections.users;
// const reviews = mongoCollections.reviews;
const parksClass = require('./parks');
const usersClass = require('./users');
const {ObjectId} = require('mongodb');
const e = require('express');
const createReview = async (
  parkId,
  userId,
  reviewTitle,
  content,
  rating
) => {

  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';


  if (!reviewTitle) throw 'You must provide a review title';
  if(typeof reviewTitle !== 'string') throw 'reviewTitle must be a string';
  
  if(!userId) throw 'You must provide a user id';
  if(typeof userId !== 'string' && typeof userId !== 'object') throw 'userId must be a string or ObjectId';
  if(typeof userId === 'string'){
    if(!ObjectId.isValid(userId)) throw 'userId is not a user r valid ObjectId';
  }
  if(userId.trim().length === 0) throw 'userId cannot be an empty string or just spaces';



  if (!content) throw 'You must provide a content';
  if(typeof content !== 'string') throw 'content must be a string';
  if(content.trim().length === 0) throw 'content cannot be an empty string or just spaces';


  if (typeof rating !== 'number') throw 'Rating must be a number';
  if (rating < 0 || rating > 5) throw 'Rating must be between 0 and 5';



  const park = await parksClass.getParkById(parkId);
  const user = await usersClass.getUserById(userId);
  const newReview = {
    _id : ObjectId(),
    title: reviewTitle,
    parkName: park.parkName,
    reviewer: user.userName,
    content: content,
    rating: rating,
    date: new Date().toLocaleDateString(),
  };
  const parkCollection = await parks();
  const userCollection = await users();
  const parkQuery = {
    _id: parkId,
  };
  const userQuery = {
    _id: ObjectId(userId),
  };

  const updateParkReview = await parkCollection.updateOne(parkQuery, {$push: {reviews : newReview}});
  const updateUserReview = await userCollection.updateOne(userQuery, {$push: {reviews : newReview}});
  if (updateParkReview.modifiedCount === 0) {
    throw 'could not update Park review successfully';
  }
  if (updateUserReview.modifiedCount === 0) {
    throw 'could not update User review successfully';
  }


  const thisPark = await parksClass.getParkById(parkId);
  const reviews = thisPark.reviews;
  let ratingSum = 0;
  for (let i = 0; i < reviews.length; i++){
    ratingSum += reviews[i].rating;
  }
  let newRating = ratingSum / reviews.length;
  if(!Number.isInteger(newRating)){
    newRating = newRating.toFixed(1);
  }
  if (newRating != thisPark.overallRating){

    const updateRating = await parkCollection.updateOne(parkQuery, {$set: {overallRating : newRating}});
    if (updateRating.modifiedCount === 0) {
      throw 'could not update rating successfully';
    } 
  }
  return newReview._id.toString();
};


const getAllReviews = async (parkId) => {
  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  parkId = parkId.trim();
  
  const thisPark = await parksClass.getParkById(parkId);
  if (!thisPark) throw 'park not found';

  let reviews = thisPark.reviews;
  for ( let i = 0; i < reviews.length; i++){
    reviews[i]._id = reviews[i]._id.toString();
  }
  return reviews;
};

const getAllUserReviews = async (userId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim(); 
  const thisUser = await usersClass.getUserById(userId);
  if (!thisUser) throw 'user not found';

  let reviews = thisUser.reviews;
  for ( let i = 0; i < reviews.length; i++){
    reviews[i]._id = reviews[i]._id.toString();
  }
  return reviews;
};
const getReview = async (reviewId) => {
  if (!reviewId) throw 'You must provide an id to search for';
  if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof reviewId === 'string') {
    if (!ObjectId.isValid(reviewId)) throw 'Id is not a valid ObjectId';
  }
  if (reviewId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';

  reviewId = reviewId.trim();

  
  const allpark = await parksClass.getAllparks();
  let review = [];
  for (let i = 0; i < allpark.length; i++){
    for (let j = 0; j < allpark[i].reviews.length; j++){
      if (allpark[i].reviews[j]._id.toString() === reviewId){
        review = allpark[i].reviews[j];
        review._id = review._id.toString();
        return review;
      }
    }
  }
};

const removeReview = async (reviewId) => {
  if (!reviewId) throw 'You must provide an id to search for';
  if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof reviewId === 'string') {
    if (!ObjectId.isValid(reviewId)) throw 'Id is not a valid ObjectId';
  }
  if (reviewId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';

  reviewId = reviewId.trim();
  const allparks = await parksClass.getAllParks();
  let parkId = '';
  let userId = '';
  for (let i = 0; i < allparks.length; i++){
    let reviews = allparks[i].reviews;
    for (let j = 0; j < reviews.length; j++){
      if (reviews[j]._id.toString() === reviewId){
        parkId = allparks[i]._id.toString();
        let userName = reviews[j].reviewer;
        let user = await usersClass.getUserByName(userName);
        userId = user._id.toString();
        break;
      }
    }
  }

  const parkCollection = await parks();
  let removepark;
  let removeAllreviews = await getAllReviews(parkId);
  if (removeAllreviews.length === 1){
    removepark = await parkCollection.updateOne({_id: parkId}, {$pop: {reviews: -1}});
  } else {
    removepark = await parkCollection.updateOne({ _id: parkId }, { $pull: { reviews: { _id: ObjectId(reviewId) } } });
  }
  if (removepark.modifiedCount === 0) {
    throw 'could not delete review Park successfully';
  }

  let removeuser;
  const userCollection = await users();
  const user = await usersClass.getUserById(userId);
  if (user.reviews.length === 1){
    removeuser = await userCollection.updateOne({_id: ObjectId(userId)}, {$pop: {reviews: -1}});
  } else {
    removeuser = await userCollection.updateOne({ _id: ObjectId(userId)}, { $pull: { reviews: { _id: ObjectId(reviewId) } } });
  }
  if (removeuser.modifiedCount === 0) {
    throw 'could not delete review User successfully';
  }

  const thisPark = await parkCollection.findOne({ _id: parkId });
  let ratingSum = 0;
  const query = {
    _id: parkId,
  };
  for (let i = 0; i < removeAllreviews.length; i++){
    ratingSum += removeAllreviews[i].rating;
  }
  let newRating = 0;
  try{
    if(reviews.length !== 0){
      newRating = ratingSum / removeAllreviews.length;
    } 
    if(!Number.isInteger(newRating)){
      newRating = newRating.toFixed(1);
    }
  } catch (e){
    newRating = 0;
  }
  if (newRating != thisPark.overallRating){

    await parkCollection.updateOne(query, {$set: {overallRating : newRating}});
  }
  
};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview,
  getAllUserReviews
};

const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const parksClass = require('./parks');
const {ObjectId} = require('mongodb');
const e = require('express');
const createReview = async (
  parkId,
  reviewTitle,
  userId,
  content,
  rating
) => {

  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof parkId === 'string') {
    if (!ObjectId.isValid(parkId)) throw 'Id is not a valid ObjectId';
  }
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';


  if (!reviewTitle) throw 'You must provide a review title';
  if(typeof reviewTitle !== 'string') throw 'reviewTitle must be a string';
  
  if(!userId) throw 'You must provide a user id';
  if(typeof userId !== 'string' && typeof userId !== 'object') throw 'userId must be a string or ObjectId';
  if(typeof userId === 'string'){
    if(!ObjectId.isValid(userId)) throw 'userId is not a valid ObjectId';
  }
  if(userId.trim().length === 0) throw 'userId cannot be an empty string or just spaces';



  if (!content) throw 'You must provide a content';
  if(typeof content !== 'string') throw 'content must be a string';
  if(content.trim().length === 0) throw 'content cannot be an empty string or just spaces';


  if (typeof rating !== 'number') throw 'Rating must be a number';
  if (rating < 0 || rating > 5) throw 'Rating must be between 0 and 5';
  //const parkReview = park.reviews;
  //const parkCollection = await parks();
  const newReview = {
    _id: ObjectId(),
    title: reviewTitle,
    reviewer: reviewerName,
    review: review,
    rating: rating,
    date: new Date().toLocaleDateString(),
  };
  
  const query = {
    _id: ObjectId(parkId),
  };

  const parkCollection = await parks();
  const updateReview = await parkCollection.updateOne(query, {$push: {reviews : newReview}});
  if (updateReview.modifiedCount === 0) {
    throw 'could not update review successfully';
  }
  const reviews = await getAllReviews(parkId);
  const thisPark = await parkCollection.findOne({ _id: ObjectId(parkId) });
  let ratingSum = 0;
  for (let i = 0; i < reviews.length; i++){
    ratingSum += reviews[i].rating;
  }
  let newRating = ratingSum / reviews.length;
  if(!Number.isInteger(newRating)){
    newRating = newRating.toFixed(1);
  }
  if (newRating != thisPark.overallRating){

    const updateRating = await parkCollection.updateOne(query, {$set: {overallRating : newRating}});
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
  if (typeof parkId === 'string') {
    if (!ObjectId.isValid(parkId)) throw 'Id is not a valid ObjectId';
  }
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  parkId = parkId.trim();
  const parkCollection = await parks();
  const thisPark = await parkCollection.findOne({ _id: ObjectId(parkId) });
  if (!thisPark) throw 'park not found';

  let reviews = thisPark.reviews;
  for ( let i = 0; i < reviews.length; i++){
    reviews[i]._id = reviews[i]._id.toString();
    //console.log(reviews[i]._id);
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

  const allpark = await parkClass.getAllparks();
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
  throw 'Review not found';
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
  const allparks = await parkClass.getAllparks();
  let parkId = '';
  for (let i = 0; i < allparks.length; i++){
    let reviews = allparks[i].reviews;
    for (let j = 0; j < reviews.length; j++){
      if (reviews[j]._id.toString() === reviewId){
        parkId = allparks[i]._id.toString();
        break;
      }
    }
  }
  const parkCollection = await parks();
  let removepark;
  let removeAllreviews = await getAllReviews(parkId);
  if (removeAllreviews.length === 1){
    removepark = await parkCollection.updateOne({_id: ObjectId(parkId)}, {$pop: {reviews: -1}});
    //removepark = await parkCollection.updateOne({_id: ObjectId(parkId)}, {$set: {reviews: []}});
  } else {
    removepark = await parkCollection.updateOne({ _id: ObjectId(parkId) }, { $pull: { reviews: { _id: ObjectId(reviewId) } } });
  }

  
  if (removepark.modifiedCount === 0) {
    throw 'could not delete review successfully';
  }


  const thisPark = await parkCollection.findOne({ _id: ObjectId(parkId) });
  let ratingSum = 0;
  const query = {
    _id: ObjectId(parkId),
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
  return await parkClass.getparkById(parkId);
};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview,
};

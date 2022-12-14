const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const parksClass = require('./parks');
const usersClass = require('./users');
const {ObjectId} = require('mongodb');
const app = require('express');

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
    title: reviewTitle,
    parkId:park._id,
    parkName: park.parkName,
    userId: user._id,
    userName: user.userName,
    content: content,
    rating: rating,
    lastUpdatedTime : new Date().toLocaleDateString(),
    comments:[],
    number_of_likes: 0,
  };

  const reviewCollection = await reviews();
  const insertInfo = await reviewCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) throw 'Could not add review';
  const newId = insertInfo.insertedId.toString();

  await parksClass.addReview(parkId, newId,rating);
  await usersClass.addReview(userId, newId);
  
  const review = await reviewCollection.findOne({ _id: ObjectId(newId) });
  return review;
};

const getEveryReviews = async () => {
  const reviewsCollection = await reviews()
  const reviewList = await reviewsCollection.find({}).toArray()
  for (let i = 0; i < reviewList.length; i++) {
    reviewList[i]._id = reviewList[i]._id.toString();
  }
  return reviewList;
}

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

  const park = await parksClass.getParkById(parkId);
  return park.reviews;
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

  const reviewCollection = await reviews();
  const review = await reviewCollection.findOne({ _id: ObjectId(reviewId) });
  if (!review) throw 'review not found';
  return review;
};

const removeReview = async (reviewId) => {
  if (!reviewId) throw 'You must provide an review id to search for';
  if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof reviewId === 'string') {
    if (!ObjectId.isValid(reviewId)) throw 'Id is not a valid ObjectId';
  }
  if (reviewId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';

  reviewId = reviewId.trim();
  const review = await getReview(reviewId);
  const parkId = review.parkId;
  await parksClass.removeReview(parkId, reviewId);
  await usersClass.removeReview(review.userId, reviewId);
  const reviewCollection = await reviews();
  const deletionInfo = await reviewCollection.deleteOne({ _id: ObjectId(reviewId) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${reviewId}`;
  }  
};

const addComment = async (reviewId, commentId) => {

  const reviewsCollection = await reviews();
  const updatedInfo = await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $push: { comments: commentId } });
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not add comment successfully';
  }
};

const removeComment = async (reviewId, commentId) => {
  const reviewsCollection = await reviews();
  const review = await reviewsCollection.findOne({ _id: ObjectId(reviewId) });
  if (!review) throw 'review not found';
  const comments = review.comments;
  if (comments.length === 1){
    const updatedInfo = await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $pop: { comments: -1 } });
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not remove comment successfully';
    }
  } else {
    const updatedInfo = await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $pull: { comments: commentId } });
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not remove comment successfully';
    }
  }
};

const updateReview = async (reviewId, content, reviewTitle) => {

  const reviewsCollection = await reviews();
  const updatedReview = {
    reviewTitle:reviewTitle,
    content: content,
    lastUpdatedTimeStamp: new Date().toLocaleDateString(),
  };
  const updatedInfo = await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $set: updatedReview });
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update review successfully';
  }
  return await getReview(reviewId);
};
module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview,
  getAllUserReviews,
  addComment,
  removeComment,
  updateReview,
  getEveryReviews
};

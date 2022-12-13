const mongoCollections = require('../config/mongoCollections');
const parkDB = mongoCollections.parks;
const userDB = mongoCollections.users;
const reviewDB = mongoCollections.reviews;
const park = require('./parks');
const user = require('./users');
const review = require('./reviews')
const {ObjectId} = require('mongodb');
const app = require('express');

const addLike = async (
    viewerId,
    reviewId
) => {
    const userCollection = await userDB();
    const likedReview = await userCollection.findOne({ _id: ObjectId(viewerId)});
    let hasLike = false;
    const likedReviewList = likedReview.likes;

    likedReviewList.map((val, i) => { if (val === reviewId) { hasLike = true }});
    if (hasLike) throw '[addLike]User has already liked this review';
    const viewer = await user.getUserById(viewerId);
    const updatedViewer = { likes: reviewId }
    const updatedViewerInfo = await userCollection.updateOne({ _id: ObjectId(viewerId) }, { $push: updatedViewer });
    if (updatedViewerInfo.modifiedCount === 0) {
      throw '[addLike]could not update likes list successfully';
    }
    const reviewsCollection = await reviewDB();
    const review = await reviewsCollection.findOne({ _id: ObjectId(reviewId) });
    const updatedReview = { number_of_likes: review.number_of_likes+1}
    const updatedReviewInfo = await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $set: updatedReview });
    if (updatedReviewInfo.modifiedCount === 0) {
      throw '[addLike]could not update review successfully';
    }
    const authorId = review.userId;
    const author = await userCollection.findOne({ _id: ObjectId(authorId) });
    const updatedAuthor = {likesReceivedAmount: author.likesReceivedAmount+1}
    const updatedAuthorInfo = await userCollection.updateOne({ _id: ObjectId(authorId) }, { $set: updatedAuthor });
    if (updatedAuthorInfo.modifiedCount === 0) {
      throw '[addLike]could not update author likes recieved amount successfully';
    }
    return await reviewsCollection.findOne({ _id: ObjectId(reviewId) });
}

const removeLike = async (
    viewerId,
    reviewId
) => {
    const userCollection = await userDB();
    const likedReview = await userCollection.find({ _id: ObjectId(viewerId), likes: {_id: ObjectId(reviewId)} })
    if (!likedReview) throw '[removeLike]User has not liked this review yet'
    const viewer = await user.getUserById(viewerId)
    let viewerLikes = viewer.likes
    // delete this review in viewer's likes list
    viewerLikes.map((val, i) => { if (val === reviewId) { viewerLikes.splice(i, 1) }})
    const updatedViewer = { likes: viewerLikes }
    const updatedViewerInfo = await userCollection.updateOne({ _id: ObjectId(viewerId) }, { $set: updatedViewer });
    if (updatedViewerInfo.modifiedCount === 0) {
      throw '[removeLike]could not update likes list successfully';
    }
    const review = await review.getReview(reviewId)
    const reviewsCollection = await reviewDB();
    const updatedReview = { number_of_likes: review.number_of_likes-1}
    const updatedReviewInfo = await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $set: updatedReview });
    if (updatedReviewInfo.modifiedCount === 0) {
      throw '[removeLike]could not update review successfully';
    }
    const authorId = review.userId
    const author = await user.getUserById(authorId)
    const updatedAuthor = {likesRecievedAmount: author.likesRecievedAmount-1}
    const updatedAuthorInfo = await userCollection.updateOne({ _id: ObjectId(authorId) }, { $set: updatedAuthor });
    if (updatedAuthorInfo.modifiedCount === 0) {
      throw '[removeLike]could not update author likes recieved amount successfully';
    }
    return await getReview(reviewId);
}

module.exports = {
    addLike,
    removeLike,
};
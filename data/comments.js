
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;

const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const userClass = require('./users');
const reviewsClass = require('./reviews');
const createComment = async (
reviewId,
userId,
content) => {
    if (!reviewId) throw 'You must provide a review id';
    if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
        throw 'reviewId must be a string or ObjectId';
    if (reviewId.trim().length === 0)
        throw 'reviewId cannot be an empty string or just spaces';

    if (!userId) throw 'You must provide an user id';
    if (typeof userId !== 'string' && typeof userId !== 'object')
        throw 'Id must be a string or ObjectId';
    if (userId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    if (!content) throw 'You must provide a content';
    if (typeof content !== 'string') throw 'content must be a string';
    if (content.trim().length === 0)
        throw 'content cannot be an empty string or just spaces';
    const user = await userClass.getUserById(userId);
    const newComment = {
        userId: user._id,
        userName: user.userName,
        commentDate: new Date().toLocaleDateString(),
        content: content,
        reviewId: reviewId,};
    const commentCollection = await comments();
    const insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) throw 'Could not add comment';
    const newId = insertInfo.insertedId.toString();
    
    const comment = await commentCollection.findOne({_id: ObjectId(newId)});
    await reviewsClass.addComment(reviewId, newId);
    await userClass.addComment(userId, newId);
    return comment;
};

const getAllComments = async(reviewID) => {
    if (!reviewID) throw 'You must provide an id to search for';
    if (typeof reviewID !== 'string' && typeof reviewID !== 'object')
      throw 'Id must be a string or ObjectId';
    if (typeof reviewID === 'string') {
      if (!ObjectId.isValid(reviewID)) throw 'Id is not a valid ObjectId';
    }
    if (reviewID.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    reviewID =reviewID.trim();

    const commentResults = await reviewClass.getReview(reviewID);
    if (commentResults === null) throw 'No review with that reviewID';
    return commentResults.comment;
};

const getCommentById = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string' && typeof id !== 'object')
        throw 'Id must be a string or ObjectId';
    if (id.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: ObjectId(id)});
    if (comment === null) throw 'No comment with that id';
    return comment;
}

const removeComment = async (commentId) => {

    if (!commentId) throw 'You must provide an comment id';
    if (typeof commentId !== 'string' && typeof commentId !== 'object')
        throw 'Id must be a string or ObjectId';
    if (commentId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';

    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: ObjectId(commentId)});
    
    if (comment === null) throw 'No comment with that id';
    const userId = comment.userId;
    const reviewId = comment.reviewId;
    await userClass.removeComment(userId, commentId);
 
    await reviewsClass.removeComment(reviewId, commentId);
    
    const deletionInfo = await commentCollection.deleteOne({_id: ObjectId(commentId)});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete comment with id of ${commentId}`;
    }
};

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    removeComment
};
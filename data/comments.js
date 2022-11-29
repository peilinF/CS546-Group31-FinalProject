
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const userClass = require('./users');
const reviewClass = require('./reviews');
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");

const createComment = async (
reviewId,
userId,
conent) => {
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
    if (!conent) throw 'You must provide a content';
    if (typeof conent !== 'string') throw 'content must be a string';
    if (conent.trim().length === 0)
        throw 'content cannot be an empty string or just spaces';
    const user = await userClass.getUserById(userId);
    const newComment = {
        userId: user._id,
        userName: user.userName,
        commentDate: new Date().toLocaleDateString(),
        content: conent,};
    const commentCollection = await comments();
    const insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) throw 'Could not add comment';
    const newId = insertInfo.insertedId.toString();
    
    const comment = await commentCollection.findOne({_id: ObjectId(newId)});
    await reviewClass.addComment(reviewId, comment._id.toString());
    await userClass.addComment(userId, comment._id.toString());
    
    return comment;
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

const removeComment = async (userId, reviewId, commentId) => {

    if (!userId) throw 'You must provide an user id';
    if (typeof userId !== 'string' && typeof userId !== 'object')
        throw 'Id must be a string or ObjectId';
    if (userId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';

    if (!reviewId) throw 'You must provide an review id';
    if (typeof reviewId !== 'string' && typeof reviewId !== 'object')
        throw 'Id must be a string or ObjectId';
    if (reviewId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';

    if (!commentId) throw 'You must provide an comment id';
    if (typeof commentId !== 'string' && typeof commentId !== 'object')
        throw 'Id must be a string or ObjectId';
    if (commentId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';

    const commentCollection = await comments();
    const deletionInfo = await commentCollection.deleteOne({_id: ObjectId(commentId)});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete comment with id of ${commentId}`;
    }
    await reviewClass.removeComment(reviewId, commentId);
    await userClass.removeComment(userId, commentId);
};

module.exports = {
    createComment,
    getCommentById,
    removeComment,
};
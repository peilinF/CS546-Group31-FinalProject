const usersData = require('./users');
const reviewData = require('./reviews');
const commentData = require('./comments');
const parkData = require('./parks');
const rankData = require('./rank')
const likeData = require('./likes')
module.exports = {
    users: usersData,
    reviews: reviewData,
    comments: commentData,
    parks: parkData,
    rank: rankData,
    like: likeData
};
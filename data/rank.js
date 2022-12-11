// const mongoCollections = require('../config/mongoCollections');
// const users = mongoCollections.users;
const userData = require('./users');
const parkData = require('./parks');
// const reviewData = require('./reviews');
// const {ObjectId} = require('mongodb');
// const helper = require("../helpers.js");

const rankUsers = async (
    option,
    itemsNum = 10,
    reverse = 'false'
    ) => {
    let allUsers = await userData.getAllUsers()

    if (option === 'followersAmount') {
        allUsers.sort(function(a,b){b.followers.length-a.followers.length})
    } else if (option === 'likesRecieved') {
        allUsers.sort(function(a,b){b.likesRecievedAmount-a.likesRecievedAmount})
    } else if (option === 'commentsAmount') {
        allUsers.sort(function(a,b){b.comments.length-a.comments.length})
    } else {
        throw `option ${option} have not been developed yet`
    }

    if (reverse === 'true') {
        allUsers = allUsers.reverse()
    }

    const results = allUsers.slice(0, itemsNum)

    for (let i=0,len=results.length; i<len; i++) {
        results[i].rank = i+1
    }

    return results
}

const rankParks = async (
    option,
    reverse = 'false'
    ) => {
    let allParks = await parkData.getAllParks()

    if (option === 'overallRating') {
        allParks.sort(function(a,b){b.overallRating-a.overallRating})
    } else if (option === 'reviewsAmount') {
        allParks.sort(function(a,b){b.reviews.length-a.reviews.length})
    } else if (option === 'wishtovisit') {
        allParks.sort(function(a,b){b.wishVisitAmount-a.wishVisitAmount})
    } else if (option === 'visited') {
        allParks.sort(function(a,b){b.visitedAmount-a.visitedAmount})
    } else {
        throw `option ${option} have not been developed yet`
    }

    if (reverse === 'true') {
        allParks = allParks.reverse()
    }

    const results = allParks

    for (let i=0,len=results.length; i<len; i++) {
        results[i].rank = i+1
    }

    return results
}

module.exports = {
    rankUsers,
    rankParks
};
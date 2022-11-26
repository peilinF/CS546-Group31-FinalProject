// const mongoCollections = require('../config/mongoCollections');
// const users = mongoCollections.users;
const userData = require('./users');
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

    results = allUsers.slice(0, itemsNum)

    for (let i=0,len=results.length; i<len; i++) {
        results[i].rank = i+1
    }

    return results
}

module.exports = {
    rankUsers
};
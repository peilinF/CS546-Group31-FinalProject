// const mongoCollections = require('../config/mongoCollections');
// const users = mongoCollections.users;
const userData = require('./users');
const parkData = require('./parks');
const reviewData = require('./reviews')
// const reviewData = require('./reviews');
// const {ObjectId} = require('mongodb');
// const helper = require("../helpers.js");

const rankUsers = async (
    option,
    itemsNum = 10,
    reverse = 'true'
    ) => {
    let allUsers = await userData.getAllUsers()
    let results = [];

    if(option !== 'followersAmount' && option !== 'likesRecieved' && option !== 'commentsAmount' && option !== 'reviewsAmount'){
        throw `option ${option} have not been developed yet`
    } else {
        if (option === 'followersAmount' || option === 'commentsAmount' || option === 'reviewsAmount'){
            results = bubbleSortByLength(allUsers, option.slice(0, option.indexOf('Amount')));
        } else {
            results = bubbleSort(allUsers, option.slice(0, option));
        }
    }

    // if (option === 'followersAmount') {
    //     allUsers.sort(function(a,b){b.followers.length-a.followers.length})
    // } else if (option === 'likesRecieved') {
    //     allUsers.sort(function(a,b){b.likesRecievedAmount-a.likesRecievedAmount})
    // } else if (option === 'commentsAmount') {
    //     allUsers.sort(function(a,b){b.comments.length-a.comments.length})
    // } else {
    //     throw `option ${option} have not been developed yet`
    // }

    if (reverse === 'false') {
        results = results.reverse()
    }

    results = results.slice(0, itemsNum)

    for (let i=0,len=results.length; i<len; i++) {
        results[i].rank = i+1
    }

    return results
}

const rankParks = async (
    option,
    reverse = 'true'
    ) => {
    let allParks = await parkData.getAllParks();
    let results = [];

    if(option !== 'overallRating' && option !== 'reviewsAmount' && option !== 'wishedAmount' && option !== 'visitedAmount'){ 
        throw `option ${option} have not been developed yet`
    } else {
        if (option === 'reviewsAmount'){
            results = bubbleSortByLength(allParks, 'reviews');
        } else {
            results = bubbleSort(allParks, option);
        }
    }

    if (reverse === 'false') {
        results = results.reverse()
    }

    for (let i=0,len=results.length; i<len; i++) {
        results[i].rank = i+1
    }

    return results
}

const rankReviews = async (
    option,
    itemsNum = 10,
    reverse = 'true'
    ) => {
    let allReviews = await reviewData.getEveryReviews();
    let results = [];

    if(option !== 'lastUpdatedTime' && option !== 'number_of_likes'){
        throw `option ${option} have not been developed yet`
    } else {
        results = bubbleSort(allReviews, option);
    }

    // if (option === 'lastUpdatedTime') {
    //     allReviews.sort(function(a,b){b.lastUpdatedTimeStamp-a.lastUpdatedTimeStamp})
    // } else if (option === 'number_of_likes') {
    //     allReviews.sort(function(a,b){b.number_of_likes-a.number_of_likes})
    // } else {
    //     throw `option ${option} have not been developed yet`
    // }

    // if (reverse === 'false') {
    //     allReviews = allReviews.reverse()
    // }
    if (reverse === 'false') {
        results = results.reverse()
    }

    results = results.slice(0, itemsNum)

    for (let i=0,len=results.length; i<len; i++) {
        results[i].rank = i+1
    }

    return results
}

const bubbleSort = (lis, option) => {

    let len = lis.length;
    for (let i = len-1; i>=0; i--){
        for(let j = 1; j<=i; j++){
            if(lis[j-1][option] > lis[j][option]){
                let temp = lis[j-1];
                lis[j-1] = lis[j];
                lis[j] = temp;
            }
        }
    }
    return lis;
};

const bubbleSortByLength = (lis, option) => {
    
        let len = lis.length;
        for (let i = len-1; i>=0; i--){
            for(let j = 1; j<=i; j++){
                if(lis[j-1][option].length > lis[j][option].length){
                    let temp = lis[j-1];
                    lis[j-1] = lis[j];
                    lis[j] = temp;
                }
            }
        }
        return lis;
}
module.exports = {
    rankUsers,
    rankParks,
    rankReviews
};
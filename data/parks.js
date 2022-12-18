const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const reviews = mongoCollections.reviews;
const reviewsClass = require('./reviews');
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const createPark = async (
    id,
    parkName,
    stateCode,
    address,
    map,
    park_picture,
    introduction,
    linkInformation,
    contacts,
    fee
  ) => {
    let reviews = [];
    let overallRating = 0;
    const newPark = {
      _id : id,
      parkName: parkName,
      stateCode: stateCode,
      address: address,
      map: map,
      park_picture: park_picture,
      introduction: introduction,
      linkInformation: linkInformation,
      contacts: contacts,
      entranceFees: fee,
      reviews: reviews,
      overallRating: overallRating,
      wishedAmount: 0,
      visitedAmount: 0,
    };
  
    const parksCollection = await parks();
    const insertInfo = await parksCollection.insertOne(newPark);
    if (insertInfo.insertedCount === 0) throw 'Could not add park';
    return await getParkById(insertInfo.insertedId.toString());
  };

const getAllParks = async () => {

    const parkCollection = await parks();
    const parkList = await parkCollection.find({}).toArray();
    for (let i = 0; i < parkList.length; i++) {
        parkList[i]._id = parkList[i]._id.toString();
    }
    if (!parkList) parkList = [];
    return parkList;
};

const getParkByState = async (stateCode) => {
    if (!stateCode) throw 'You must provide an id to search for';
    if (typeof stateCode !== 'string') throw 'Id must be a string';
    if (stateCode.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    stateCode = stateCode.trim();
    const allParks = await getAllParks();
    let parks = [];
    for (let i = 0; i < allParks.length; i++) {
        if (allParks[i].stateCode === stateCode) {
            parks.push(allParks[i]);
        }
    }
    return parks;

};
const getParkById = async (parkId) => {
    if (!parkId) throw 'You must provide an id to search for';
    if (parkId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkId = parkId.trim();
    const parksCollection = await parks();
    const park = await parksCollection.findOne({ _id: parkId });
    if (!park) throw 'Park not found';
    park._id = park._id.toString();
    for(let j = 0; j < park.reviews.length; j++){
        park.reviews[j] = park.reviews[j].toString();
    }
    return park;
};

const getParkByName = async (parkName) => {
    if (!parkName) throw 'You must provide an parkName to search for';
    if (typeof parkName !== 'string') throw 'ParkName must be a string';
    if (parkName.trim().length === 0)
        throw 'ParkName cannot be an empty string or just spaces';
    parkName = parkName.trim();
    const parksCollection = await parks();
    const park = await parksCollection.findOne({ parkName: parkName });
    if (!park) throw 'Park not found';
    park._id = park._id.toString();
    // for(let j = 0; j < park.reviews.length; j++){
    //     park.reviews[j]._id = park.reviews[j]._id.toString();
    // }
    return park;
  };

const addReview = async (parkId, reviewId,rating) => {
    if (!parkId) throw 'You must provide an id to search for';
    if (typeof parkId !== 'string') throw 'Id must be a string';
    if (parkId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkId = parkId.trim();
    if (!reviewId) throw 'You must provide an id to search for';
    if (typeof reviewId !== 'string') throw 'Id must be a string';
    if (reviewId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    reviewId = reviewId.trim();
    const parksCollection = await parks();

    const thisPark = await parksCollection.findOne({_id : parkId});
    const reviewList = thisPark.reviews;
    let ratingSum = rating ;
    const reviewsCollection = await reviews();
    let review = null;
    for (let i = 0; i< reviewList.length;i ++){
        
        review = await reviewsCollection.findOne({_id : ObjectId(reviewList[i])});
        ratingSum  = ratingSum +  review.rating;
    } 
    let length = reviewList.length + 1;
    let newRating = ratingSum/length;
    if(!Number.isInteger(newRating)){
        newRating = newRating.toFixed(1);
    }
    if (newRating != thisPark.overallRating){

        const updateRating = await parksCollection.updateOne({ _id: parkId }, {$set: {overallRating : newRating}});
        if (updateRating.modifiedCount === 0) {
        throw 'could not update rating successfully';
        } 
    }
    try{
        const updatePark =  await parksCollection.updateOne({ _id: parkId }, { $push: { reviews: reviewId } });
        if (updatePark.modifiedCount === 0) {
            throw "'could not update rating successfully'"
        }
    } catch (e) {
        throw e;
    }
}

const removeReview = async (parkId, reviewId) => {
    if (!parkId) throw 'You must provide an park id to search for';
    if (typeof parkId !== 'string') throw 'Id must be a string';
    if (parkId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkId = parkId.trim();
    if (!reviewId) throw 'You must provide an review id to search for in park';
    if (typeof reviewId !== 'string') throw 'Id must be a string';
    if (reviewId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    reviewId = reviewId.trim();
    const parksCollection = await parks();
    let thisPark = await parksCollection.findOne({_id : parkId});
    let parkReviews = thisPark.reviews;
    //let update = 0
    const reviewsCollection = await reviews();
    let review = await reviewsCollection.findOne({ _id: ObjectId(reviewId) });

    let rating = review.rating;
    let ratingSum =  - rating;


    for (let i = 0; i< parkReviews.length;i ++){
        review = await reviewsCollection.findOne({_id : ObjectId(parkReviews[i])});
        ratingSum  = ratingSum +  review.rating;
    } 
    let newRating = 0;
    if (parkReviews.length - 1 === 0) {
        newRating  = 0;
    } else {
        newRating = ratingSum / (parkReviews.length - 1);
    }
    if(!Number.isInteger(newRating)){
        newRating = newRating.toFixed(1);
    }
    if (newRating != thisPark.overallRating){
        const updateRating = await parksCollection.updateOne({ _id: parkId }, {$set: {overallRating : newRating}});
        if (updateRating.modifiedCount === 0) {
        throw 'could not update rating successfully';
        }
    }

   
    try{
        if (reviews.length === 1 && reviews[0] === reviewId){
            update = await parksCollection.updateOne({ _id: parkId }, {$pop: { reviews: -1 }});
        }else{
            update = await parksCollection.updateOne({ _id: parkId}, { $pull: { reviews: reviewId } });
        }
        if (update.modifiedCount === 0) {
            throw 'could not remove review successfully';
        }
    } catch(e) {
       throw e;
    }
}

const updateRating = async (parkName) => {
    if (!parkName) throw 'You must provide an park name to search for';
    if (typeof parkName !== 'string') throw 'Id must be a string';
    if (parkName.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkName = parkName.trim();
    try{
        const parksCollection = await parks();
        const reviewsCollection = await reviews();
        let thisPark = await parksCollection.findOne({parkName : parkName});
        let parkId = thisPark._id;
        let parkReviews = thisPark.reviews;
        let ratingSum = 0;
        let review;
        for (let i = 0; i< parkReviews.length;i ++){
            review = await reviewsCollection.findOne({_id : ObjectId(parkReviews[i])});
            ratingSum  = ratingSum +  review.rating;
        } 
        let newRating = ratingSum / parkReviews.length;
        if(!Number.isInteger(newRating)){
            newRating = newRating.toFixed(1);
        }
        if (newRating != thisPark.overallRating){
            const updateRating = await parksCollection.updateOne({ _id: parkId }, {$set: {overallRating : newRating}});
            if (updateRating.modifiedCount === 0) {
            throw 'could not update rating successfully';
            }
        }
    } catch (e) {
        throw e;
    }
    
}

module.exports = {
    createPark,
    getAllParks,
    getParkById,
    getParkByName,
    getParkByState,
    addReview,
    removeReview,
    updateRating
}

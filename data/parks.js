const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const reviews = mongoCollections.reviews;
//const reviews = mongoCollections.reviews;
const reviewsClass = require('./reviews');
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const createPark = async (
    id,
    parkName,
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
      address: address,
      map: map,
      park_picture: park_picture,
      introduction: introduction,
      linkInformation: linkInformation,
      contacts: contacts,
      entranceFees: fee,
      reviews: reviews,
      overallRating: overallRating,
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
    if (!parkName) throw 'You must provide an id to search for';
    if (typeof parkName !== 'string') throw 'Id must be a string';
    if (parkName.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkName = parkName.trim();
    const parksCollection = await parks();
    const park = await parksCollection.findOne({ parkName: parkName });
    if (!park) throw 'Park not found';
    park._id = park._id.toString();
    for(let j = 0; j < park.reviews.length; j++){
        park.reviews[j]._id = park.reviews[j]._id.toString();
    }
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
    parksCollection.updateOne({ _id: parkId }, { $push: { reviews: reviewId } });

    const thisPark = await getParkById(parkId);
    const reviews = thisPark.reviews;
    let ratingSum = (reviews.length - 1)* thisPark.overallRating + rating;
    let length = reviews.length;
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
    let thisPark = await getParkById(parkId);
    let parkReviews = thisPark.reviews;
    let update = 0
    if (reviews.length === 1){
        update = await parksCollection.updateOne({ _id: parkId }, {$pop: { reviews: -1 }});
    }else{
        update = await parksCollection.updateOne({ _id: parkId}, { $pull: { reviews: reviewId } });
    }
    if (update.modifiedCount === 0) {
        throw 'could not remove review successfully';
    }

    thisPark = await getParkById(parkId);
    parkReviews = thisPark.reviews;
    const reviewsCollection = await reviews();
    const review = await reviewsCollection.findOne({ _id: ObjectId(reviewId) });
    let overallRating = thisPark.overallRating;
    let rating = review.rating;
    let ratingSum = (parkReviews.length + 1) * overallRating - rating;
    let newRating = ratingSum / parkReviews.length;
    if (parkReviews.length === 0){
        newRating = 0;
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
}
module.exports = {
    createPark,
    getAllParks,
    getParkById,
    getParkByName,
    addReview,
    removeReview
}

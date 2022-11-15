const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const reviews = mongoCollections.reviews;
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const createPark = async (
  id,
  parkName,
  address,
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
        park.reviews[j]._id = park.reviews[j]._id.toString();
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

  
module.exports = {
    createPark,
    getAllParks,
    getParkById,
    getParkByName
}

const mongoCollections = require('../config/mongoCollections');
const parks = mongoCollections.parks;
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const createPark = async (
  parkName,
  address,
  park_picture,
  date_of_builld,
  introduction,
  linkInformation
) => {

    if (!parkName) throw 'You must provide a park name';
    if (typeof parkName !== 'string') throw 'Park name must be a string';
    if (parkName.trim().length === 0)
        throw 'Park name cannot be an empty string or just spaces';
    parkName = parkName.trim();
    if (!address) throw 'You must provide a address';
    if (typeof address !== 'string') throw 'Address must be a string';
    if (address.trim().length === 0)
        throw 'Address cannot be an empty string or just spaces';
    address = address.trim();
    if (!park_picture) throw 'You must provide a park picture';
    if (typeof park_picture !== 'string') throw 'Park picture must be a string';
    if (park_picture.trim().length === 0)
        throw 'Park picture cannot be an empty string or just spaces';
    park_picture = park_picture.trim();
    if (!date_of_builld) throw 'You must provide a date of build';
    if (typeof date_of_builld !== 'string') throw 'Date of build must be a string';
    if (date_of_builld.trim().length === 0)
        throw 'Date of build cannot be an empty string or just spaces';
    date_of_builld = date_of_builld.trim();
    if (!introduction) throw 'You must provide a introduction';
    if (typeof introduction !== 'string') throw 'Introduction must be a string';
    if (introduction.trim().length === 0)
        throw 'Introduction cannot be an empty string or just spaces';
    introduction = introduction.trim();
    if (!linkInformation) throw 'You must provide a link information';
    if (typeof linkInformation !== 'string') throw 'Link information must be a string';
    if (linkInformation.trim().length === 0)
        throw 'Link information cannot be an empty string or just spaces';
    linkInformation = linkInformation.trim();

  helper.validDate(date_of_builld);
  let reviews = [];
  let overallRating = 0;
  const newPark = {

    parkName: parkName,
    address: address,
    park_picture: park_picture,
    date_of_builld: date_of_builld,
    introduction: introduction,
    linkInformation: linkInformation,
    reviews: reviews,
    overallRating: overallRating,

  };

  const parksCollection = await parks();
  const insertInfo = await parksCollection.insertOne(newPark);
  if (insertInfo.insertedCount === 0) throw 'Could not add park';
  const newId = insertInfo.insertedId.toString();
  const park = await getParkById(newId);
  return park;
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
    
    if (typeof parkId === 'string') {
        if (!ObjectId.isValid(parkId)) throw 'Id is not a valid ObjectId';
    }
    if (parkId.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    parkId = parkId.trim();
    const parksCollection = await parks();
    const park = await parksCollection.findOne({ _id: ObjectId(parkId) });
    if (!park) throw 'Movie not found';
    park._id = park._id.toString();
    for(let j = 0; j < park.reviews.length; j++){
        park.reviews[j]._id = park.reviews[j]._id.toString();
    }
    return park;
};

const removePark = async (parkId) => {
  if (!parkId) throw 'You must provide an id to search for';
  if (typeof parkId !== 'string' && typeof parkId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof parkId === 'string') {
    if (!ObjectId.isValid(parkId)) throw 'Id is not a valid ObjectId';
  }
  if (parkId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  parkId = parkId.trim();
  const parkCollection = await parks();
  const park = await getParkById(parkId);
  const deletionInfo = await parkCollection.deleteOne({ _id: ObjectId(parkId) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${parkId}`;
  }
  
  return parkId;
};

const updatePark = async (
  parkId,
  parkName,
  address,
  park_picture,
  date_of_builld,
  introduction,
  linkInformation
) => {

  if (!parkName) throw 'You must provide a park name';
  if (typeof parkName !== 'string') throw 'Park name must be a string';
  if (parkName.trim().length === 0)
      throw 'Park name cannot be an empty string or just spaces';
  parkName = parkName.trim();
  if (!address) throw 'You must provide a address';
  if (typeof address !== 'string') throw 'Address must be a string';
  if (address.trim().length === 0)
      throw 'Address cannot be an empty string or just spaces';
  address = address.trim();
  if (!park_picture) throw 'You must provide a park picture';
  if (typeof park_picture !== 'string') throw 'Park picture must be a string';
  if (park_picture.trim().length === 0)
      throw 'Park picture cannot be an empty string or just spaces';
  park_picture = park_picture.trim();
  if (!date_of_builld) throw 'You must provide a date of build';
  if (typeof date_of_builld !== 'string') throw 'Date of build must be a string';
  if (date_of_builld.trim().length === 0)
      throw 'Date of build cannot be an empty string or just spaces';
  date_of_builld = date_of_builld.trim();
  if (!introduction) throw 'You must provide a introduction';
  if (typeof introduction !== 'string') throw 'Introduction must be a string';
  if (introduction.trim().length === 0)
      throw 'Introduction cannot be an empty string or just spaces';
  introduction = introduction.trim();
  if (!linkInformation) throw 'You must provide a link information';
  if (typeof linkInformation !== 'string') throw 'Link information must be a string';
  if (linkInformation.trim().length === 0)
      throw 'Link information cannot be an empty string or just spaces';
  linkInformation = linkInformation.trim();

  helper.validDate(date_of_builld);

  const update = {
    parkName: parkName,
    address: address,
    park_picture: park_picture,
    date_of_builld: date_of_builld,
    introduction: introduction,
    linkInformation: linkInformation,
  };

  const parkCollection = await parks();
  const updatedPark = {
    $set: update,
  };
  const query = {
    _id: ObjectId(parkId),
  };

  const updateInfo = await parkCollection.updateOne(query, updatedPark);
  if(updateInfo.modifiedCount === 0) {
    throw 'could not update movie successfully';
  }
  return await getParkById(parkId);


};

const renamePark = async (id, newName) => {
  //Not used for this lab

  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string' && typeof id !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof id === 'string') {
    if (!ObjectId.isValid(id)) throw 'Id is not a valid ObjectId';
  }
  if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  id = id.trim();
  if (!newName) throw 'You must provide a new name';
  if (typeof newName !== 'string') throw 'New name must be a string';
  if (newName.trim().length === 0)
    throw 'New name cannot be an empty string or just spaces';
  newName = newName.trim();
  const parkCollection = await parks();
  const updatedPark = {
    $set: { parkName: newName },
  };
  const query = {
    _id: ObjectId(id),
  };
  const updateInfo = await parkCollection.updateOne(query, updatedPark);
  if(updateInfo.modifiedCount === 0) {
    throw 'could not update movie successfully';
  }
  return await getMovieById(id);
};

module.exports = {
    createPark,
    getAllParks,
    getParkById,
    removePark,
    updatePark,
    renamePark

}

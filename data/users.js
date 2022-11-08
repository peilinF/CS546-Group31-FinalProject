const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const helper = require("../helpers.js");
const createUser = async (
  userName,
  email,
  birthDate,
  hashedPassword
) => {
  
  let reviews = [];
  let comments = [];
  let parksHaveVisited = [];
  let parksWishToGo = [];
  let likes = [];
  const newUser = {
    userName: userName,
    email: email,
    birthDate: birthDate,
    hashedPassword: hashedPassword,
    reviews: reviews,
    comments: comments,
    parksHaveVisited: parksHaveVisited,
    parksWishToGo: parksWishToGo,
    likes: likes,
  };

  if (!userName) throw 'You must provide a user name';
  if (typeof userName !== 'string') throw 'User name must be a string';
  if (userName.trim().length === 0)
    throw 'User name cannot be an empty string or just spaces';
  userName = userName.trim();
  
  if (!email) throw 'You must provide an email';
  if (typeof email !== 'string') throw 'Email must be a string';
  if (email.trim().length === 0)
    throw 'Email cannot be an empty string or just spaces';
  email = email.trim();
  if (!helper.validateEmail(email)) throw 'Email is not valid';

  if (!birthDate) throw 'You must provide a birth date';
  if (typeof birthDate !== 'string') throw 'Birth date must be a string';
  if (birthDate.trim().length === 0)
    throw 'Birth date cannot be an empty string or just spaces';
  birthDate = birthDate.trim();
  if (!helper.validateDate(birthDate)) throw 'Birth date is not valid';

  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw 'Could not add user';
  const newId = insertInfo.insertedId.toString();
  const user = await getUserById(newId);
  return user;
};

const getAllUsers = async () => {
  const usersCollection = await users();
  const userList = await usersCollection.find({}).toArray();
  for (let i = 0; i < userList.length; i++) {
    userList[i]._id = userList[i]._id.toString();
    // for(let j = 0; j < movieList[i].reviews.length; j++){
    //   movieList[i].reviews[j]._id = movieList[i].reviews[j]._id.toString();
    // }
  }
  if (!userList) movieList = [];
  return userList;
};

const getUserById = async (userId) => {
  if (!userId) throw 'You must provide an id to search for';
  if (typeof userId !== 'string' && typeof userId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof userId === 'string') {
    if (!ObjectId.isValid(userId)) throw 'Id is not a valid ObjectId';
  }
  if (userId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(movieId) });
  if (!user) throw 'Movie not found';
  user._id = user._id.toString();
  // for(let j = 0; j < movie.reviews.length; j++){
  //   user.reviews[j]._id = user.reviews[j]._id.toString();
  // }
  return user;
};

const removeMovie = async (movieId) => {
  if (!movieId) throw 'You must provide an id to search for';
  if (typeof movieId !== 'string' && typeof movieId !== 'object')
    throw 'Id must be a string or ObjectId';
  if (typeof movieId === 'string') {
    if (!ObjectId.isValid(movieId)) throw 'Id is not a valid ObjectId';
  }
  if (movieId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  movieId = movieId.trim();
  const movieCollection = await movies();
  const movie = await getMovieById(movieId);
  const deletionInfo = await movieCollection.deleteOne({ _id: ObjectId(movieId) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${movieId}`;
  }
  
  return movieId;
};

const updateMovie = async (
  movieId,
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime
) => {
  if (!movieId) throw 'You must provide an id to search for';
  if (typeof movieId !== 'string' && typeof id !== 'object') throw 'Id must be a string or ObjectId';
  if (typeof movieId === 'string') {
    if (!ObjectId.isValid(movieId)) throw 'Id is not a valid ObjectId';
  }
  if (movieId.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  movieId = movieId.trim();

  if (!title) throw 'You must provide a title';
  if (typeof title !== 'string') throw 'Title must be a string';
  if (title.trim().length === 0)
    throw 'Title cannot be an empty string or just spaces';
  if (!plot) throw 'You must provide a plot';
  if (typeof plot !== 'string') throw 'Plot must be a string ';
  if (plot.trim().length === 0)
    throw 'Plot cannot be an empty string or just spaces';
  if (!genres) throw 'You must provide a genre';
  if (!Array.isArray(genres)) throw 'Genres must be an array';
  if (genres.length === 0) throw 'Genres array cannot be empty';
  if (!rating) throw 'You must provide a rating';
  if (typeof rating !== 'string') throw 'Rating must be a string';
  if (rating.trim().length === 0) throw 'Rating must be between 0 and 5';
  if (!studio) throw 'You must provide a studio';
  if (typeof studio !== 'string') throw 'Studio must be a string';
  if (studio.trim().length === 0)
    throw 'Studio cannot be an empty string or just spaces';
  if (studio.trim().length < 5) throw 'Studio must be at least 5 characters';
  
  if (!director) throw 'You must provide a director';
  if (typeof director !== 'string') throw 'Director must be a string';
  if (director.trim().length === 0)
    throw 'Director cannot be an empty string or just spaces';
  
  if (!castMembers) throw 'You must provide a cast member';
  if (!Array.isArray(castMembers)) throw 'Cast members must be an array';
  if (castMembers.length === 0) throw 'Cast members array cannot be empty';
  if (!dateReleased) throw 'You must provide a date released';
  if (typeof dateReleased !== 'string') throw 'Date released must be a string';
  if (dateReleased.trim().length === 0)
    throw 'Date released cannot be an empty string or just spaces';
  if (!runtime) throw 'You must provide a runtime';
  if (typeof runtime !== 'string') throw 'Runtime must be a string';
  if (runtime.trim().length === 0) throw 'Runtime must be greater than 0';
  title = title.trim();
  studio = studio.trim();
  rating = rating.trim();
  director = director.trim();
  dateReleased = dateReleased.trim();
  plot = plot.trim();
  runtime = runtime.trim();

  if (title.length < 2) throw 'Title must be at least 2 characters';
  if (studio.length < 5) throw 'Studio must be at least 5 characters';
  if (!/^[a-zA-Z ']+$/.test(studio)) throw 'Studio must be letters only';
  
  let dName = director.split(' ');
  if (dName.length !== 2) throw 'Director must be first and last name';
  if (!/^[a-zA-Z]+$/.test(dName[0])) throw 'Director must be letters only';
  if (!/^[a-zA-Z']+$/.test(dName[1])) throw 'Director must be letters only';
  if (dName[0] < 3 || dName[1] < 3) throw 'length of director name must longer or equal to 3';
  if (rating !== 'G' && rating !== 'PG' && rating !== 'PG-13' && rating !== 'R' && rating !== 'NC-17') throw 'Rating must be G, PG, PG-13, R, or NC-17';
  
  for (let element of genres) {
    if (typeof element !== 'string') throw 'Genres must be strings';
    if (element.trim().length < 5)
      throw 'Genres must be at leat five characters';
    if (!/^[a-zA-Z]+$/.test(element))
      throw 'Genres must be letters only';
  }

  for (let element of castMembers) {
    if (typeof element !== 'string') throw 'Cast members must be strings';
    if (element.trim().length === 0)
      throw 'Cast members must be just space';

    let cName = element.split(' ');
    if (cName.length !== 2) throw 'Cast members must be first and last name';
    if (!/^[a-zA-Z]+$/.test(cName[0])) throw 'Cast members must be letters only';
    if (!/^[a-zA-Z']+$/.test(cName[1])) throw 'Cast members must be letters only';
    if(cName[0].length < 3 || cName[1].length < 3) throw 'Cast members must be at least 3 characters';
  }

  helper.validDate(dateReleased);
  helper.validTime(runtime);

  const update = {

    title: title,
    plot: plot,
    genres: genres,
    rating: rating,
    studio: studio,
    director: director,
    castMembers: castMembers,
    dateReleased: dateReleased,
    runtime: runtime,
  };

  const movieCollection = await movies();
  const updatedMovie = {
    $set: update,
  };
  const query = {
    _id: ObjectId(movieId),
  };

  const updateInfo = await movieCollection.updateOne(query, updatedMovie);
  if(updateInfo.modifiedCount === 0) {
    throw 'could not update movie successfully';
  }
  return await getMovieById(movieId);


};

const renameMovie = async (id, newName) => {
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
  const movieCollection = await movies();
  const updatedMovie = {
    $set: { title: newName },
  };
  const query = {
    _id: ObjectId(id),
  };
  const updateInfo = await movieCollection.updateOne(query, updatedMovie);
  if(updateInfo.modifiedCount === 0) {
    throw 'could not update movie successfully';
  }
  return await getMovieById(id);
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  removeMovie,
  renameMovie,
  updateMovie
};

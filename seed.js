const data = require("./data");
const likes = data.like;
const parks = data.parks;
const users = data.users;
const reviews = data.reviews;
const comments = data.comments;
const update = data.updates;
const constant = require("./constant");
const { ObjectId } = require("mongodb");
const connection = require("./config/mongoConnection");
const axios = require("axios");
const parkurl =
  "https://developer.nps.gov/api/v1/parks?limit=468&api_key=52KiEVABmztoxDerGdxyqMEYVGIPiO5nmkBXGII4";
const parkRequest = axios.request(parkurl, {
  headers: { Accept: "application/json", "Accept-Encoding": "identity" },
  params: { trophies: true },
});
const helper = require("./helpers");
const main = async () => {
  const db = await connection.dbConnection();
  await db.dropDatabase();
  await createPark();
  const user = await createUser();
  const park = await parks.getParkByName("Lake Clark National Park & Preserve");

  const review = await reviews.createReview(
    park._id.toString(),
    user.userId,
    "title",
    "content",
    4
  );
  const review2 = await reviews.createReview(
    park._id.toString(),
    user.userId,
    "title1",
    "content1",
    3
  );

  const comment = await comments.createComment(
    review._id.toString(),
    user.userId.toString(),
    "comment"
  );

  await createMutiLikeEvents();
  // const comment2 = await comments.createComment(review2._id.toString(), user._id.toString(), 'comment2');

  // await comments.removeComment(user._id.toString(), review2._id.toString(),comment._id.toString());
  //await parks.updateReviewById(park._id.toString(), review._id.toString());
  //console.log(allPark);
  await connection.closeConnection();
  console.log("Done!");
  //await parks.updateReviewById(park._id.toString(), review._id.toString());
};

const createReview = async (parkId, userID) => {
  const review = await reviews.createReview(
    parkId,
    userID,
    "title",
    "content",
    5
  );
  //await update.updateParkReviewById(parkId, review._id.toString());
  return review;
};

const createUser = async () => {
  const user = await users.createUser(
    "aaaaa",
    "xixi@gmail.com",
    "2022-12-01",
    helper.hashPassword("Feng@fpl1997"),
    "What is your mother's first name?",
    "Ying",
    "What is your born city?",
    "Beijing"
  );
  return user;
};

const createMutiUsers = async () => {
  const userList = [];
  const usersInfos = [
    ['mike', 'xixi0@gmail.com','2022-12-01',helper.hashPassword('Feng@fpl1997'),"What is your mother's first name?",'Ying','What is your born city?',"Beijing"],
    ['John', 'xixi1@gmail.com','2022-12-01',helper.hashPassword('Feng@fpl1997'),"What is your mother's first name?",'Ying','What is your born city?',"Beijing"],
    ['wendy', 'xixi2@gmail.com','2022-12-01',helper.hashPassword('Feng@fpl1997'),"What is your mother's first name?",'Ying','What is your born city?',"Beijing"],
    ['jack', 'xixi3@gmail.com','2022-12-01',helper.hashPassword('Feng@fpl1997'),"What is your mother's first name?",'Ying','What is your born city?',"Beijing"],
    ['nick', 'xixi4@gmail.com','2022-12-01',helper.hashPassword('Feng@fpl1997'),"What is your mother's first name?",'Ying','What is your born city?',"Beijing"],
] 

  for (let i = 0, len = usersInfos.length; i < len; i++) {
    let userInfo = usersInfos[i];
    let user = await users.createUser(
      userInfo[0],
      userInfo[1],
      userInfo[2],
      userInfo[3],
      userInfo[4],
      userInfo[5],
      userInfo[6],
      userInfo[7]
    );
    userList.push(user);
  }
  return userList;
};

const createMutiLikeEvents = async () => {
  const [userMike, userJohn, userWendy, userJack, userNick] = await createMutiUsers();
  console.log("userMike", userMike);
  const park = await parks.getParkByName("Lake Clark National Park & Preserve");
  const reviewMike = await reviews.createReview(
    park._id.toString(),
    userMike.userId,
    "Good place",
    "content",
    5
  );
  const reviewJohn = await reviews.createReview(
    park._id.toString(),
    userJohn.userId,
    "Not good place",
    "content",
    3
  );
  await likes.addLike(userWendy.userId.toString(), reviewMike._id.toString());
  await likes.addLike(userJack.userId.toString(), reviewMike._id.toString());
  await likes.addLike(userNick.userId.toString(), reviewJohn._id.toString());

  const park2 = await parks.getParkByName("Mount Rainier National Park")

  await users.addParksWishToGO(userMike.userId.toString(), park._id.toString())
  await users.addParksHaveVisited(userMike.userId.toString(), park2._id.toString())
};

const parsePark = (park) => {
  let id = park.id;
  let parkName = park.fullName;
  let stateCode = park.addresses[0].stateCode;
  let address =
    park.addresses[0].line1 +
    " " +
    park.addresses[0].city +
    " " +
    park.addresses[0].stateCode +
    " " +
    park.addresses[0].postalCode;
  let map = `https://www.google.com/maps/place/${park.addresses[0].line1}+${park.addresses[0].city}+${park.addresses[0].stateCode}+${park.addresses[0].postalCode}`;
  let park_picture = park.images[0].url;
  let introduction = park.description;
  let linkInformation = park.url;

  let contacts = [];
  for (let j = 0; j < park.contacts.phoneNumbers.length; j++) {
    let phone = park.contacts.phoneNumbers[j].phoneNumber;
    let type = park.contacts.phoneNumbers[j].type;
    let contact = {
      phone: phone,
      type: type,
    };
    contacts.push(contact);
  }

  let fee = [];
  for (let j = 0; j < park.entranceFees.length; j++) {
    let cost = park.entranceFees[j].cost;
    let description = park.entranceFees[j].description;
    let title = park.entranceFees[j].title;
    let feeInfo = {
      cost: cost,
      description: description,
      title: title,
    };
    fee.push(feeInfo);
  }
  // if (parkName.includes("&")) {
  //   parkName = parkName.replace("&", "and");
  //   console.log(parkName);
  // }
  return [
    id,
    parkName,
    stateCode,
    address,
    map,
    park_picture,
    introduction,
    linkInformation,
    contacts,
    fee,
  ];
};

const createPark = async () => {
  const parkResponse = await parkRequest;
  const parkData = parkResponse.data.data;
  
  for (let i = 0; i < parkData.length; i++) {
    let park = parkData[i];
    if (constant.parkNameList.includes(park.fullName)) {
      const information = parsePark(park);
      await parks.createPark(
        information[0],
        information[1],
        information[2],
        information[3],
        information[4],
        information[5],
        information[6],
        information[7],
        information[8],
        information[9]
      );
    }
  }
  
};

main().catch(console.log);

module.exports = {
  parkRequest,
  parsePark,
};

const data = require("./data");
const likes = data.like;
const parks = data.parks;
const users = data.users;
const reviews = data.reviews;
const comments = data.comments;
const update = data.updates;
const constant = require("./extra/constant.js");
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
  
  await connection.closeConnection();
  console.log("Done!");
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
    "xixixixi@gmail.com",
    "2012-12-01",
    "Kuku@fpl1997",
    "What is your best friend's name?",
    "Ying",
    "In what city were you born?",
    "Beijing"
  );
  return user;
};

const createMutiUsers = async () => {
  const userList = [];
  const usersInfos = [
    ['mike11', 'xixixixi0@gmail.com','1995-02-14','FENG@fpl1997',"What is your mother's first name?",'Sam',"Is there anything you can't live without?","Sugar"],
    ['John22', 'John1@gmail.com','1985-03-21','John@fpl1997',"What was your favorite food as a child?",'Dumplings','In what city were you born?',"Beijing"],
    ['wendy33', 'wendy2@gmail.com','1980-04-30','Wendy@fpl1997',"What is your mother's first name?",'Ming','In what city were you born?',"Beijing"],
    ['jack44', 'jack443@gmail.com','1975-05-15','Jack@fpl1997',"Who is you love most person?",'Mom','In what city were you born?',"NewYork"],
    ['nick55', 'nick554@gmail.com','1965-07-12','Nick@fpl1997',"What is the name of your favorite pet?",'Kitty','What was your favorite food as a child?',"Pizza"],
    ['bobhaha66', 'bobhaha66@gmail.com','1990-01-03','Bobby@fpl1997',"What is your mother's first name?",'Ying','In what city were you born?',"Beijing"],
    ['GGboy77', 'GGboy77@gmail.com', '1992-12-01','Gboy@fpl1997',"Who is you love most person?",'Son','In what city were you born?',"Hoboken"],
    ['Cindy77', 'Cindy776@gmail.com', '1995-02-19','Cindy@fpl1997',"Where did you meet your spouse?",'Cinema','Who is you love most person?',"Myself"],
    ['Alice1','alice.smith@gmail.com','1990-01-01','Alice@123aa',"What is the name of your favorite pet?",'GG',"What is your best friend's name?","James"],
    ['Bobj2','bob.johnson@gmail.com','1995-02-14','Bob@456ss',"Is there anything you can't live without?",'Phone','In what city were you born?',"Boston"]
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
  const userList = await createMutiUsers();


  const parkList = constant.parkNameList.splice(0, 10);

  for (let i = 0, len = parkList.length; i < len; i++) {
    let parkName = parkList[i];
    let park = await parks.getParkByName(parkName);
    let review;
    let lastReview;
    for (let j = 0, len = userList.length; j < len; j++) {
      let user = userList[j];
      let number = Math.floor(Math.random() * 5);
      if (number == 0) {
        review = await createReview(park._id.toString(), user.userId, "Very Good place", "very good", 5);
        
      } else if (number == 1) {
        review = await createReview(park._id.toString(), user.userId, "Good place", "good", 4);
      } else if (number == 2) {
        review= await createReview(park._id.toString(), user.userId, "Not Good place", "normal", 3);
      } else if (number == 3) {
        review= await createReview(park._id.toString(), user.userId, "Bad place", "bad", 2);
      } else if (number == 4) {
        review= await createReview(park._id.toString(), user.userId, "Very Bad place", "shit", 1);
      }
      await users.addParksHaveVisited(user.userId.toString(), park._id.toString())
      await likes.addLike(user.userId.toString(), review._id.toString());
      if (lastReview) {
        await comments.createComment( review._id.toString(), user.userId.toString(), "agree");
      }
      
      lastReview = review;
    }
    
  }

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

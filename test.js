const DUMMY_USER = {
    "userID" : "507f1f77bcf86cd799439011",
    "userName" : "Alexia Dua",
    "email" : "Alexia@gmail.com",
    "birthDate" : "05/06/2000",
    "harshPassword" : "$2a$08$XdvNkNIL8F8xsuIUeSbNOF",
    "reviews" : ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    "comments" : ["607f1f77bcf86cd998739013"],
    "ParksHaveVisited" : ["7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310","507f1f77bcf86cd799439011"],
    "ParksWishToGo" : ["7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311","7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311"],
    "likes" : ["507f1f77bcf86cd799439013","507f1f77bcf86cd799439012","603d992b919a503b9afb856e"]
  }

const DUMMY_REVIEW = {

}

const seed = require('./seed')
// const parkInfo = seed.parkInfo
const parkInfo = axios.get('https://developer.nps.gov/api/v1/parks?api_key=52KiEVABmztoxDerGdxyqMEYVGIPiO5nmkBXGII4');
const parsePark = seed.parsePark
const fetchAllParks = async() => {
  const parkList = await parkInfo;
  if (!parkList) throw `[fetchAllParks] no parkList ${parkList}`
  const parkData = parkList.data.data;
  if (!parkData) throw `[fetchAllParks] no parkData ${parkData}`
  let allparks = []
  
  for (let i = 0; i < parkData.length; i++) {
      let park = parkData[i]
      let id, parkName, address, park_picture, introduction, linkInformation, contacts, fee
      try {
        id, parkName, address, park_picture, introduction, linkInformation, contacts, fee = parsePark(park)
      } catch (e) {
        throw `[parsePark] Error: ${e}`
      }
      let reviews = [];
      let overallRating = 0;
      let newPark = {
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
      }
      allparks.push(newPark)
  }
  return allparks
}

module.exports = {
  DUMMY_USER,
  fetchAllParks
};
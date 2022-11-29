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
const axios = require('axios');
const parkInfo = axios.get('https://developer.nps.gov/api/v1/parks?api_key=52KiEVABmztoxDerGdxyqMEYVGIPiO5nmkBXGII4');

const creatPark = async() => {
    const parkList = await parkInfo;
    const parkData = parkList.data.data;
    let park = [];  
    for (let i = 0; i < parkData.length; i++) {
        let park = parkData[i];
        let id = park.id;
        let parkName = park.fullName;
        let address = park.addresses[0].line1 + ' ' + park.addresses[0].city + ' ' + park.addresses[0].stateCode + ' ' + park.addresses[0].postalCode;
        let park_picture = park.images[0].url;
        let introduction = park.description;
        let linkInformation = park.url;

        let contacts = [];
        for (let j = 0; j < park.contacts.phoneNumbers.length; j++) {
            let phone = park.contacts.phoneNumbers[j].phoneNumber;
            let type = park.contacts.phoneNumbers[j].type;
            let contact = {
                phone: phone,
                type: type
            }
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
                title: title
            }
            fee.push(feeInfo);
        }

        park.push({ id : id, parkName : parkName, address : address, park_picture : park_picture, introduction : introduction, linkInformation : linkInformation, contacts : contacts, fee : fee});
    }
    return park;
};
module.exports = {
  DUMMY_USER,
  fetchAllParks
};
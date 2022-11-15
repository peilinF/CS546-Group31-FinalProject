const data = require('./data');
const parks = data.parks;
const users = data.users;
const reviews = data.reviews;
const update = data.updates;
const { ObjectId } = require('mongodb');
const connection = require('./config/mongoConnection');
const axios = require('axios');
const parkInfo = axios.get('https://developer.nps.gov/api/v1/parks?api_key=52KiEVABmztoxDerGdxyqMEYVGIPiO5nmkBXGII4')
const helper = require('./helpers');
const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();
    await creatPark();
    const user = await createUser();
    const park = await parks.getParkByName('Acadia National Park');
    const review = await createReview(park._id.toString(), user._id.toString());
    const review2 = await reviews.createReview(park._id.toString(), user._id.toString(), 'title1', 'content1', 3);

    await reviews.removeReview(review);
    //await parks.updateReviewById(park._id.toString(), review._id.toString());
    //console.log(allPark);
    await connection.closeConnection();
    console.log('Done!');
    //await parks.updateReviewById(park._id.toString(), review._id.toString());
};

const createReview = async (parkId, userID) => {
    const review = await reviews.createReview(parkId, userID, 'title', 'content', 5);
    //await update.updateParkReviewById(parkId, review._id.toString());
    return review;
};

const createUser = async () => {
    const user = await users.createUser('aaa', 'xixi@gmail.com','08/08/1998',helper.hashPassword('Feng@fpl1997'));
    return user;
};

const creatPark = async() => {
    const parkList = await parkInfo;
    const parkData = parkList.data.data;
    
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

        await parks.createPark(id, parkName, address, park_picture, introduction, linkInformation, contacts, fee);
    }
};

main().catch(console.log);
const axios = require('axios');
const parkInfo = axios.get('https://developer.nps.gov/api/v1/parks?api_key=52KiEVABmztoxDerGdxyqMEYVGIPiO5nmkBXGII4');

const creatPark = async() => {
    const parkList = await parkInfo;
    const parkData = parkList.data.data;
    let parks = [];  
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

        parks.push({ id : id, parkName : parkName, address : address, park_picture : park_picture, introduction : introduction, linkInformation : linkInformation, contacts : contacts, fee : fee});
    }
    return parks;
};
const main = async () => {
    console.log(await creatPark());
};
main().catch(console.log);
module.exports = {
    creatPark
}
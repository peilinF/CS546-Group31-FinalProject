const data = require('./data');
const parks = data.parks;
const { ObjectId } = require('mongodb');
const connection = require('./config/mongoConnection');
const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    const park = await parks.createPark("Name", "Location", "Image", "09/15/1995","introduction", "https://www.nps.gov/yell/index.htm");
    const park2 = await parks.createPark("Name2", "Location2", "Image2", "09/15/1995","introduction2", "https://www.nps.gov/yell/index.htm");
    let removeId = await parks.removePark(park._id);
    console.log(allPark);
    await connection.closeConnection();
    console.log('Done!');

};

main().catch(console.log);
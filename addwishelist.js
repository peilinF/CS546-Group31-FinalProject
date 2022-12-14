const data = require("./data");
const users = data.users;
const parks = data.parks;

const main = async () => {
    const userMike = await users.getUserByName('mike')

    const park = await parks.getParkByName("Lake Clark National Park & Preserve");
    const park2 = await parks.getParkByName("Mount Rainier National Park")

    await users.addParksWishToGO(userMike.userId.toString(), park._id.toString())
    await users.addParksHaveVisited(userMike.userId.toString(), park2._id.toString())
}

main().catch(console.log);
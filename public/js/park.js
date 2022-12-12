const parkNameList = 
[
    "Denali National Park & Preserve",
    "Gates Of The Arctic National Park & Preserve",
    "Glacier Bay National Park & Preserve",
    "Katmai National Park & Preserve",
    "Kenai Fjords National Park",
    "Kobuk Valley National Park",
    "Lake Clark National Park & Preserve",
    "Wrangell - St Elias National Park & Preserve",
    "Crater Lake National Park",
    "Mount Rainier National Park",
    "North Cascades National Park",
    "Olympic National Park",
    "Channel Islands National Park",
    "Death Valley National Park",
    "Joshua Tree National Park",
    "Sequoia & Kings Canyon National Parks",
    "Lassen Volcanic National Park",
    "Pinnacles National Park",
    "Redwood National and State Parks",
    "Yosemite",
    "Arches",
    "Big Bend",
    "Bryce Canyon",
    "Canyonlands",
    "Capitol Reef",
    "Carlsbad Caverns",
    "Grand Canyon",
    "Great Basin",
    "Guadalupe Mountains",
    "Petrified Forest",
    "Saguaro",
    "White Sands",
    "Zion",
    "Black Canyon",
    "Grand Teton",
    "Great Sand Dunes",
    "Glacier National Park",
    "Mesa Verde",
    "Rocky Mountain",
    "Yellowstone",
    "Acadia",
    "Badlands",
    "Cuyahoga Valley",
    "Gateway Arch",
    "Hot Springs",
    "Indiana Dunes",
    "Isle Royale",
    "Theodore Roosevelt",
    "Voyageurs",
    "Wind Cave",
    "Biscayne",
    "Congaree",
    "Dry Tortugas",
    "Everglades",
    "Great Smoky Mountain",
    "Mammoth Cave",
    "Shenandoah",
    "New River Gorge",
    "Haleakala",
    "Hawai'i Volcanoes",
    "America Samoa",
    "Virgin Islands",
];

let parkListButton = document.getElementById("get-park-list-btn")
parkListButton.addEventListener("click", async () => {
    let parkListContainer = document.querySelector(".park-list")
    parkNameList.forEach((parkName) => {
        let parkContainer = document.createElement("div")
        parkContainer.classList.add("park-item")

        let parkNameElement = document.createElement("h3")
        parkNameElement.innerText = parkName

        parkContainer.appendChild(parkNameElement)

        parkListContainer.appendChild(parkContainer)
    });
})
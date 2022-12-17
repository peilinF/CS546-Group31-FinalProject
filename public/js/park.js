const parkNameList = [
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
    "Yosemite National Park",
    "Arches National Park",
    "Big Bend National Park",
    "Bryce Canyon National Park",
    "Canyonlands National Par",
    "Capitol Reef National Park",
    "Carlsbad Caverns National Park",
    "Grand Canyon National Park",
    "Great Basin National Park",
    "Guadalupe Mountains National Park",
    "Petrified Forest National Park",
    "Saguaro National Park",
    "White Sands National Park",
    "Zion National Park",
    "Black Canyon Of The Gunnison National Park",
    "Glacier National Park",
    "Mesa Verde National Park",
    "Rocky Mountain National Park",
    "Yellowstone National Park",
    "Acadia National Park",
    "Cuyahoga Valley National Park",
    "Gateway Arch National Park",
    "Hot Springs National Park",
    "Indiana Dunes National Park",
    "Isle Royale National Park",
    "Theodore Roosevelt National Park",
    "Voyageurs National Park",
    "Wind Cave National Park",
    "Biscayne National Park",
    "Congaree National Park",
    "Dry Tortugas National Park",
    "Everglades National Park",
    "Great Smoky Mountains National Park",
    "Mammoth Cave National Park",
    "Shenandoah National Park",
    "New River Gorge National Park & Preserve",
    "Haleakalā National Park",
    "Hawaiʻi Volcanoes National Park",
    "Virgin Islands National Park",
    "National Park of American Samoa",
    "Badlands National Park",
    "Canyonlands National Park",
    "Grand Teton National Park",
    "Great Sand Dunes National Park & Preserve",
];

let parkListButton = document.getElementById("get-park-list-btn");
parkListButton.addEventListener("click", (e) => {
  if (e.target.innerText === "Get Park List") {
    let parkListContainer = document.querySelector(".park-list");
    let parkListResult = document.createElement("div")
    parkListResult.classList.add("park-list-result")
    parkNameList.forEach((parkName) => {
      let parkContainer = document.createElement("div");
      parkContainer.classList.add("park-item");

      let parkHref = document.createElement("a");
      parkHref.href = `/park/search?searchParkName=${parkName}`;
      parkHref.innerText = `${parkName}`;
      let parkNameElement = document.createElement("h5");
      parkNameElement.appendChild(parkHref);

      parkContainer.appendChild(parkNameElement);

      parkListResult.appendChild(parkContainer);
    });
    parkListContainer.appendChild(parkListResult)
    e.target.innerText = "Hide Park List";
    e.target.style.backgroundColor = "#c44e6b";
  } else {
    let parkListResult = document.querySelector(".park-list-result")
    parkListResult.remove()
    e.target.innerText = "Get Park List";
    e.target.style.backgroundColor = "#627d69";
  }
});

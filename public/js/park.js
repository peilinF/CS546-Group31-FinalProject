const data = require("../../data")
const parkData = data.parks

console.log("======park.js loaded======")

let parkListButton = document.getElementById("get-park-list-btn")
parkListButton.addEventListener("click", async () => {
    const parkList = await parkData.getAllParks()
    let parkListContainer = document.querySelector("park-list")
    console.log("=========click start============")
    parkList.forEach((park) => {
        console.log(park.parkName)

        let parkContainer = document.createElement("div")
        parkContainer.classList.add("park-item")

        let parkName = document.createElement("h3")
        parkName.innerText = park.parkName

        parkContainer.appendChild(parkName)

        parkListContainer.appendChild(parkContainer)
    });
    console.log("=========click end============")
})
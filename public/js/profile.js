// let parkListButton = document.getElementById('btn-park-list');
// let parkList = document.getElementById('profile-park-visited-and-wished');

// parkListButton.addEventListener('click', (e) => {
//     if (e.target.innerText === "Display parks visited and wished list") {
//         parkList.style.display = '';
//         e.target.innerText = "Hide parks visited and wished list";
//         e.target.style.backgroundColor = "pink";
//     } else {
//         parkList.style.display = 'none';
//         e.target.innerText = "Display parks visited and wished list";
//         e.target.style.backgroundColor = "#839788"
//     }
// })

let profileEditButton = document.getElementById("btn-edit-profile")
let profileEditForm = document.querySelector(".edit-info")
if (profileEditButton) {
    profileEditButton.addEventListener('click', (e) => {
        if (e.target.innerText === "Edit your profile") {
            profileEditForm.style.display = '';
            e.target.innerText = "Cancel";
            e.target.style.backgroundColor = "pink";
        } else {
            profileEditForm.style.display = 'none';
            e.target.innerText = "Edit your profile";
            e.target.style.backgroundColor = "#839788"
        }
    })
}

let profileUserName = document.getElementById('profile-user-name')
let parkNameListButton = document.getElementById('btn-parkName-list');
parkNameListButton.addEventListener('click', (event) => {
    let profileParkList = document.querySelector(".profile-parklist")
    if (!profileParkList.innerHTML) {
        $.ajax({
            type:"get",
            url:`http://localhost:3000/profile/parkList?userName=${profileUserName.innerText}`,
            dataType: 'json',
            success: (parkNameList) => {
                let parkWishNameList = document.createElement("div")
                let parkWishTitle = document.createElement("h5")
                parkWishTitle.innerText = "Parks wish to visit:"
                parkWishNameList.appendChild(parkWishTitle)
                let parkVisitedNameList = document.createElement("div")
                let parkVisitedTitle = document.createElement("h5")
                parkVisitedTitle.innerText = "Parks have visited:"
                parkVisitedNameList.appendChild(parkVisitedTitle)
    
                const parkWishList = parkNameList.parkWishList
                const parkVisitedList = parkNameList.parkVisitedList
    
                for (let parkName of parkWishList) {
                    let parklink = document.createElement("a")
                    parklink.href = `/park/search?searchParkName=${parkName}`;
                    parklink.innerText = `${parkName}`;
                    parkWishNameList.appendChild(parklink);
                    parkWishNameList.appendChild(document.createElement("br"));
                }
                for (let parkName of parkVisitedList) {
                    let parklink = document.createElement("a")
                    parklink.href = `/park/search?searchParkName=${parkName}`;
                    parklink.innerText = `${parkName}`;
                    parkVisitedNameList.appendChild(parklink);
                    parkVisitedNameList.appendChild(document.createElement("br"));
                }
                
                profileParkList.appendChild(parkWishNameList)
                profileParkList.appendChild(parkVisitedNameList)
                
                // let button = event.target
                // button.style.backgroundColor = "gray"
                // button.disabled = "disabled";
            },
            error: (e) => {
                alert(e.responseText);
            }
        })
    }
    let button = event.target
    if (button.innerText === "Hidden") {
        profileParkList.style.display = "none"
        button.innerText = "Visited/Wished Park List"
        button.style.background = "#839788"
    } else {
        profileParkList.style.display = ""
        button.innerText = "Hidden"
        button.style.background = "pink"
    }
})
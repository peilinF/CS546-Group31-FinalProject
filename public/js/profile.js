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
let myProfile = document.getElementById("is-my-profile").innerText
if (myProfile === 'true') {
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
}

let reviewListButton = document.getElementById('btn-reviews-list');
reviewListButton.addEventListener('click', (event) => {
    let profileReviewList = document.querySelector(".profile-reviewlist")
    if (!profileReviewList.innerHTML) {
        $.ajax({
            type:"get",
            url:`http://localhost:3000/profile/reviewList?userName=${profileUserName.innerText}`,
            dataType: 'json',
            success: (reviewList) => {
                let reviewListTitle = document.createElement("h2")
                reviewListTitle.innerText = `Reviews Posted by ${profileUserName.innerText}`
                let reviewListTable = document.createElement("table")
                let reviewListTr = document.createElement("tr")
                let reviewTitle = document.createElement("th")
                reviewTitle.innerText = 'Title'
                let reviewRating = document.createElement("th")
                reviewRating.innerText = 'Rating'
                let reviewPark = document.createElement("th")
                reviewPark.innerText = 'Park'
                reviewListTr.appendChild(reviewTitle)
                reviewListTr.appendChild(reviewRating)
                reviewListTr.appendChild(reviewPark)
                reviewListTable.appendChild(reviewListTr)
                for (let review of reviewList) {
                    let reviewListTr = document.createElement("tr")
                    let reviewTitle = document.createElement("th")
                    reviewTitle.innerText = `${review.title}`
                    let reviewRating = document.createElement("th")
                    reviewRating.innerText = `${review.rating}`
                    let reviewPark = document.createElement("th")
                    let reviewParkLink = document.createElement("a")
                    reviewParkLink.innerText = `${review.parkName}`
                    reviewParkLink.href = `/park/search?searchParkName=${review.parkName}`;
                    reviewPark.appendChild(reviewParkLink)
                    reviewListTr.appendChild(reviewTitle)
                    reviewListTr.appendChild(reviewRating)
                    reviewListTr.appendChild(reviewPark)
                    reviewListTable.appendChild(reviewListTr)
                }
                profileReviewList.appendChild(reviewListTitle)
                profileReviewList.appendChild(reviewListTable);
            },
            error: (e) => {
                alert(e.responseText);
            }
        })
    }
    let button = event.target
    if (button.innerText === "Hidden(Reviews)") {
        profileReviewList.style.display = "none"
        button.innerText = `Review List`
        button.style.background = "#839788"
    } else {
        profileReviewList.style.display = ""
        button.innerText = "Hidden(Reviews)"
        button.style.background = "pink"
    }
})
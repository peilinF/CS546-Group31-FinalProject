// let parkListButton = document.getElementById('btn-park-list');
// let parkList = document.getElementById('profile-park-visited-and-wished');

// parkListButton.addEventListener('click', (e) => {
//     if (e.target.innerText === "Display parks visited and wished list") {
//         parkList.style.display = '';
//         e.target.innerText = "Hide parks visited and wished list";
//         e.target.style.backgroundColor = "#c44e6b";
//     } else {
//         parkList.style.display = 'none';
//         e.target.innerText = "Display parks visited and wished list";
//         e.target.style.backgroundColor = "#627d69"
//     }
// })

let profileEditButton = document.getElementById("btn-edit-profile")
let profileEditForm = document.querySelector(".edit-info")
if (profileEditButton) {
    profileEditButton.addEventListener('click', (e) => {
        if (e.target.innerText === "Edit your profile") {
            profileEditForm.style.display = '';
            e.target.innerText = "Cancel";
            e.target.style.backgroundColor = "#c44e6b";
        } else {
            profileEditForm.style.display = 'none';
            e.target.innerText = "Edit your profile";
            e.target.style.backgroundColor = "#627d69"
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
            button.style.background = "#627d69"
        } else {
            profileParkList.style.display = ""
            button.innerText = "Hidden"
            button.style.background = "#c44e6b"
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
                reviewListTitle.innerText = `Reviews posted by ${profileUserName.innerText}`
                let reviewListResults = document.createElement("div")
                reviewListResults.className = "review-list-results"
                if (reviewList.length === 0) {
                    reviewListTitle.innerText = `${profileUserName.innerText} has not posted any review yet`
                }
                for (let review of reviewList) {
                    let singleReview = document.createElement("div")
                    singleReview.className = "single-review"

                    let reviewId = document.createElement("p")
                    reviewId.className = "review-info"
                    reviewId.style.display = "none"
                    reviewId.innerText = `${review._id}`
                    let reviewTitle = document.createElement("div")
                    reviewTitle.innerText = `${review.title}`
                    reviewTitle.className = "sigle-review-item"
                    let reviewRating = document.createElement("div")
                    reviewRating.innerText = `Rating: ${review.rating}`
                    reviewRating.className = "sigle-review-item"
                    let reviewPark = document.createElement("div")
                    reviewPark.className = "sigle-review-item"
                    let reviewParkLink = document.createElement("a")
                    reviewParkLink.innerText = `${review.parkName}`
                    reviewParkLink.href = `/park/search?searchParkName=${review.parkName}`;
                    reviewPark.appendChild(reviewParkLink)
                    singleReview.appendChild(reviewId)
                    singleReview.appendChild(reviewTitle)
                    singleReview.appendChild(reviewTitle)
                    singleReview.appendChild(reviewRating)
                    singleReview.appendChild(reviewPark)
                    
                    if (myProfile === 'true') {
                        let deleteButton = document.createElement("button")
                        deleteButton.className = "deleteReview"
                        deleteButton.innerText = "Delete"
                        deleteButton.style.marginTop = "0px"
                        deleteButton.addEventListener("click", deleteAction)

                        let deleteUI = document.createElement("div")
                        deleteUI.className = "profile-deleteUi"
                        deleteUI.appendChild(deleteButton)
                        singleReview.appendChild(deleteUI)
                    }
                    
                    reviewListResults.appendChild(singleReview)
                }
                profileReviewList.appendChild(reviewListTitle)
                profileReviewList.appendChild(reviewListResults);
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
        button.style.background = "#627d69"
    } else {
        profileReviewList.style.display = ""
        button.innerText = "Hidden(Reviews)"
        button.style.background = "#c44e6b"
    }
})

const deleteAction = async (event) => {
    event.preventDefault();
    let singleReview = event.target.parentElement.parentElement
    let reviewId = singleReview.firstElementChild.innerText;
    $.ajax({
        method: 'DELETE',
        url: '/review/delete',
        contentType: "application/json",
        data: JSON.stringify({
            reviewId: reviewId,
        }),
        success: () => {
            singleReview.remove()
        },
        error: (err) => {
            alert(err.responseText);
        }
    })
}
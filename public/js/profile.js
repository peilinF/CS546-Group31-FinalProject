let parkListButton = document.getElementById('btn-park-list');
let parkList = document.getElementById('profile-park-visited-and-wished');

parkListButton.addEventListener('click', (e) => {
    if (e.target.innerText === "Display parks visited and wished list") {
        parkList.style.display = '';
        e.target.innerText = "Hide parks visited and wished list";
        e.target.style.backgroundColor = "pink";
    } else {
        parkList.style.display = 'none';
        e.target.innerText = "Display parks visited and wished list";
        e.target.style.backgroundColor = "#839788"
    }
})

let profileEditeButton = document.getElementById("btn-edite-profile")
let profileEditeForm = document.querySelector(".edite-info")
profileEditeButton.addEventListener('click', (e) => {
    if (e.target.innerText === "Edite your profile") {
        profileEditeForm.style.display = '';
        e.target.innerText = "Cancel";
        e.target.style.backgroundColor = "pink";
    } else {
        profileEditeForm.style.display = 'none';
        e.target.innerText = "Edite your profile";
        e.target.style.backgroundColor = "#839788"
    }
})
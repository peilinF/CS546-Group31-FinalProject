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

let profileEditButton = document.getElementById("btn-edit-profile")
let profileEditForm = document.querySelector(".edit-info")
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
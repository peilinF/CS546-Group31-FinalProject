let btn = document.getElementById('btn-park-list');
let parkList = document.getElementById('profile-park-visited-and-wished');

function btnHideDisplay() {
    if (btn.value == "Display parks visited and wished list") {
        parkList.style.display = ''; 
        btn.value = "Hide parks visited and wished lis";
    } else {
        parkList.style.display = 'none'; 
        btn.value = "Display parks visited and wished list";
    }
}
let likeButton = document.querySelector(".like-btn")
likeButton.addEventListener("click", () => {
    if (likeButton.style.color === "white") {
        likeButton.style.color = "green"
    } else {
        likeButton.style.color = "white"
    }
})
let nav = document.getElementById("mobile-nav");
let addButton = document.getElementById("add-all");
let gameButton = document.querySelector(".add-game");
let leagueButton = document.querySelector(".add-league");
let discussButton = document.querySelector(".add-discuss");
let buttons = document.querySelectorAll(".add-item");

addButton.addEventListener("click", () => {
    nav.classList.toggle("navigation");
    buttons.forEach((button) => {
        button.classList.toggle("add-show");
    });
    addButton.classList.toggle("add-all-move");
    gameButton.classList.toggle("add-game-move");
    leagueButton.classList.toggle("add-league-move");
    discussButton.classList.toggle("add-discuss-move");
});
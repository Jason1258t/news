document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.querySelector(".burger-menu");
    const nav = document.querySelector(".nav");

    burgerMenu.addEventListener("click", function () {
        nav.classList.toggle("active");
        burgerMenu.classList.toggle("active");
    });

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            nav.classList.remove("active");
            burgerMenu.classList.remove("active");
        });
    });
});

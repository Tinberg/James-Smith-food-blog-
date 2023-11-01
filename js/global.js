// Hamburger
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', function() {
    nav.classList.toggle('active');
});

document.addEventListener('click', function(event) {
    if (!nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});


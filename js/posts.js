//3D slider
const slides = document.querySelectorAll('.slide');
const numberOfSlides = slides.length;
const angle = 360 / numberOfSlides;

let currentActive = 0;
slides[currentActive].classList.add('active');
//This function makes the images and text slide.
function rotateSlider(direction) {
    slides[currentActive].classList.remove('active');
    if (direction === 'right') {
        currentActive = (currentActive + 1) % numberOfSlides;
    } else {
        currentActive = (currentActive - 1 + numberOfSlides) % numberOfSlides;
    }
    for (let i = 0; i < numberOfSlides; i++) {
        let currentAngle = angle * (i - currentActive);
        slides[i].style.transform = `translate(-50%, -50%) rotateY(${currentAngle}deg) translateZ(250px)`;
    }
    slides[currentActive].classList.add('active');
}

document.querySelector('.left').addEventListener('click', () => {
    rotateSlider('left');
});

document.querySelector('.right').addEventListener('click', () => {
    rotateSlider('right');
});


setInterval(() => {
    rotateSlider('right');
}, 3500);

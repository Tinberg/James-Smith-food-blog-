//3D SLIDER
const slides = document.querySelectorAll(".slide");
const heroPosts = document.querySelector(".hero-posts");
const numberOfSlides = slides.length;
const angle = 360 / numberOfSlides;

let currentActive = 0;
slides[currentActive].classList.add("active");
//this function loops through my articles and remove the bg-img that is set, and adds a new class for the next img(in css)
function updateBackgroundImage() {
  for (let i = 1; i <= numberOfSlides; i++) {
    heroPosts.classList.remove("bg-slide" + i);
  }

  heroPosts.classList.add("bg-slide" + (currentActive + 1));
}
//this function change the active slide, and make the slide go back to the beginning when there is not slides left in the loop
//its also a loop for the 3d slider(to make it 3d)
function rotateSlider(direction) {
  slides[currentActive].classList.remove("active");
  if (direction === "right") {
    currentActive = (currentActive + 1) % numberOfSlides;
  } else {
    currentActive = (currentActive - 1 + numberOfSlides) % numberOfSlides;
  }
  for (let i = 0; i < numberOfSlides; i++) {
    let currentAngle = angle * (i - currentActive);
    slides[
      i
    ].style.transform = `translate(-50%, -50%) rotateY(${currentAngle}deg) translateZ(250px)`;
  }
  slides[currentActive].classList.add("active");
  updateBackgroundImage();
}

document.querySelector(".left").addEventListener("click", () => {
  rotateSlider("left");
});

document.querySelector(".right").addEventListener("click", () => {
  rotateSlider("right");
});

updateBackgroundImage();

setInterval(() => {
  rotateSlider("right");
}, 3500);

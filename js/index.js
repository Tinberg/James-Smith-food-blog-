// Newsletter Form
document
  .querySelector(".newsletter-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for signing up!");
  });

document.addEventListener("DOMContentLoaded", function () {
  let figures = document.querySelectorAll(".slider figure");

  if (!figures.length) {
    console.error("Figures not found!");
    return;
  }

  let currentFigureIndex = 0;
  figures[currentFigureIndex].classList.add("active");

  setInterval(function () {
    figures[currentFigureIndex].classList.remove("active");
    currentFigureIndex = (currentFigureIndex + 1) % figures.length;
    figures[currentFigureIndex].classList.add("active");
  }, 3000);
});

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








//Fetch and display REST API (10posts)

async function fetchPosts(perPage = 10, page = 1) {
  const corsAnywhereUrl = "https://noroffcors.onrender.com/";
  const originalUrl = `https://james-smith.cmsbackendsolutions.com/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`;
  const url = corsAnywhereUrl + originalUrl;

  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

function createPostElement(post) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(post.content.rendered, 'text/html');
  const image = doc.querySelector('img');
  const imageUrl = image ? image.src : '';
  const imageAlt = image ? image.alt : '';

  const article = document.createElement('article');
  article.className = 'post';
  article.innerHTML = `
    <a href="/html/recipe.html?post_id=${post.id}" class="a-post box-shadow">
      <img class="img-small block" src="${imageUrl}" alt="${imageAlt}">
      <h3 class="h3-post">${post.title.rendered}</h3>
      <div class="hover-content text-left">
        <p class="flex space-between">
          MY RATING:
          <span class="rating-value">${post['rating-value']}<i class="fa-solid fa-heart"></i></span>
        </p>
        <p class="flex space-between">
          DIFFICULTY: <span class="difficulty-value">${post['difficulty-value']}</span>
        </p>
        <p class="flex space-between">
          TIME: <span class="time-value">${post['time-value']}</span>
        </p>
        <p class="flex space-between">
          CATEGORY: <span class="category-value">${post['category-value']}</span>
        </p>
        <p class="flex space-between">
          TYPE: <span class="type-value">${post['type-value']}</span>
        </p>
        <p class="flex space-between">
          ORIGIN: <span class="origin-value">${post['origin-value']}</span>
        </p>
      </div>
    </a>
  `;
  return article;
}

const postsContainer = document.querySelector('.posts');
let currentPage = 1;

//load the first then posts
function loadPosts() {
  fetchPosts(10, currentPage).then(posts => {
    posts.forEach(post => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
    
  });
}

loadPosts();

//load the rest of the post on click
const viewMoreBtn = document.getElementById('viewMoreBtn');
viewMoreBtn.addEventListener('click', () => {
  currentPage++; 
  loadPosts(); 
});


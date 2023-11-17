//---------- API, SORTBY AND FILTER-------------//

//object to store cached API
const cache = {};

// This function filter map from category in api
function getCategoryId(filterValue) {
  const categoryMap = {
    //Origin
    america: 63,
    greece: 61,
    italy: 62,
    france: 64,
    ireland: 65,
    england: 66,
    japan: 67,
    //Category
    brunch: 70,
    pastry: 68,
    dessert: 71,
    dinner: 69,
  };
  return categoryMap[filterValue] || null;
}
//Eventlistner for category filter from index page. it display the category and and loop thorugh the select element and set it to true with the current category.
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get("filter");
  const filterSelect = document.getElementById("filterSelect");

  if (filterParam) {
    for (const option of filterSelect.options) {
      if (option.value === filterParam) {
        option.selected = true;
        break;
      }
    }
  }

  loadPosts("newest", filterSelect.value);
});

//---------- Fetch -------------//

//---- This function fetch the api with 10 posts, with sortBy to newest and every posts(no filter)
async function fetchPosts(
  perPage = 10,
  page = 1,
  sortBy = "newest",
  filter = "all"
) {
  const corsAnywhereUrl = "https://noroffcors.onrender.com/";
  let originalUrl = `https://james-smith.cmsbackendsolutions.com/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`;

  // Cache key based on URL, sortBy, and filter
  const cacheKey = `${originalUrl}_${sortBy}_${filter}`;

  // Check if the response is cached
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  // SortBy and Filter logic
  if (sortBy === "newest") {
    originalUrl += "&orderby=date&order=desc";
  } else if (sortBy === "oldest") {
    originalUrl += "&orderby=date&order=asc";
  } else if (sortBy === "title1") {
    originalUrl += "&orderby=title&order=asc";
  } else if (sortBy === "title2") {
    originalUrl += "&orderby=title&order=desc";
  }

  //this logic is based on GetCategoryID from filter map, and it splits the name and id. and making the endpoint to the spesific category.
  if (filter !== "all") {
    let categoryId;

    if (filter.startsWith("origin-")) {
      categoryId = getCategoryId(filter.split("-")[1]);
    } else if (filter.startsWith("category-")) {
      categoryId = getCategoryId(filter.split("-")[1]);
    }

    if (categoryId) {
      originalUrl += `&categories=${categoryId}`;
    }
  }

  // Full api with pr0xy
  const url = corsAnywhereUrl + originalUrl;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parse the response
    const totalPosts = parseInt(response.headers.get("X-WP-Total"), 10);
    const posts = await response.json();
    // Cache the response
    cache[cacheKey] = { posts, totalPosts };

    return cache[cacheKey];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

//---------- Create -------------//

//----This function create dom and parse the img from the string. it makes the article with the post detaisl.
function createPostsElements(post) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(post.content.rendered, "text/html");
  const image = doc.querySelector("img");
  const imageUrl = image ? image.src : "";
  const imageAlt = image ? image.alt : "";

  const article = document.createElement("article");
  article.className = "post";
  article.innerHTML = `
      <a href="/html/recipe.html?post_id=${post.id}" class="a-post box-shadow">
        <img class="img-small block" src="${imageUrl}" alt="${imageAlt}">
        <h3 class="h3-post">${post.title.rendered}</h3>
        <div class="hover-content text-left">
          <p class="flex space-between">
            MY RATING:
            <span class="rating-value">${post["rating-value"]}<i class="fa-solid fa-heart"></i></span>
          </p>
          <p class="flex space-between">
            DIFFICULTY: <span class="difficulty-value">${post["difficulty-value"]}</span>
          </p>
          <p class="flex space-between">
            TIME: <span class="time-value">${post["time-value"]}</span>
          </p>
          <p class="flex space-between">
            CATEGORY: <span class="category-value">${post["category-value"]}</span>
          </p>
          <p class="flex space-between">
            TYPE: <span class="type-value">${post["type-value"]}</span>
          </p>
          <p class="flex space-between">
            ORIGIN: <span class="origin-value">${post["origin-value"]}</span>
          </p>
        </div>
      </a>
    `;
  return article;
}
//target Static HTML
const postsContainer = document.querySelector(".posts");
const viewMoreBtn = document.getElementById("viewMoreBtn");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");
const errorMessage = document.getElementById("error-message");
let currentPage = 1;

//event listners btn, sortBy and Filter.
viewMoreBtn.addEventListener("click", () => {
  currentPage++;
  loadPosts(sortSelect.value);
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  loadPosts(sortSelect.value, filterSelect.value);
});

filterSelect.addEventListener("change", () => {
  currentPage = 1;
  loadPosts(sortSelect.value, filterSelect.value);
});
//---------- Fetch and Create -------------//

//----This function load the posts based on the current page and sorting order, and filter. it create "post" for each item in the api, and shows the button, or hide depending on if there are more posts to load or not.
async function loadPosts(sortBy = "newest", filter = "all") {
  if (currentPage === 1) {
    postsContainer.innerHTML = "";
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.classList.remove("hidden");
  }
  try {
    const data = await fetchPosts(10, currentPage, sortBy, filter);
    const { posts, totalPosts } = data;
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    posts.forEach((post) => {
      const postElement = createPostsElements(post);
      postsContainer.appendChild(postElement);
    });

    if (postsContainer.children.length >= totalPosts) {
      viewMoreBtn.classList.add("hidden");
    } else {
      viewMoreBtn.classList.remove("hidden");
    }
  } catch (error) {
    viewMoreBtn.classList.add("hidden");
    errorMessage.textContent =
      "Oops! Something went wrong while loading the posts. Please check your internet connection and try again.";
    console.error("Error loading posts:", error);
  } finally {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.classList.add("hidden");
  }
}

//---------- 3D SLIDER-------------//
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

//This function change the active slide, and make the slide go back to the beginning when there is not slides left in the loop
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

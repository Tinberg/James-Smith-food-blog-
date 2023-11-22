// ---------- API and Mediaquery ----------//

// ---------- Global Variables ----------//
const postsCache = {};
let totalPages = 0;
let sliderPage = 1;
const sliderErrorMessage = document.getElementById("slider-error-message");//Error message for fetchSliderPosts and loadSliderPosts
const sliderPostErrorMessage = document.getElementById("slider-post-error-message"); //Error message for createSliderPostElement
const leftArrow = document.querySelector(".left-arrow-container");
const rightArrow = document.querySelector(".right-arrow-container");
const loaderSlider = document.getElementById("loaderSlider");

// ---------- Utility Functions ----------//
//This function set the number of posts to show per page based on the window witdh(media query)
function getPostsPerPage() {
  if (window.innerWidth > 1371) {
    return 4;
  } else if (window.innerWidth > 1059) {
    return 3;
  } else if (window.innerWidth > 744) {
    return 2;
  } else {
    return 1;
  }
}


//This function is made for loadSliderpost not to be called to often(For better preformance)
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to toggle the display or not display both arrows.
function toggleArrowsDisplay(displayState) {
    if (leftArrow) leftArrow.style.display = displayState;
    if (rightArrow) rightArrow.style.display = displayState;
  }

// ---------- Fetch Posts Function ----------//
//Fetch a specific page of posts from api and aches the results for better preformance
async function fetchSliderPosts(page = 1, perPage) {
  const corsAnywhereUrl = "https://noroffcors.onrender.com/";
  const originalUrl = `https://james-smith.cmsbackendsolutions.com/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}`;
  const url = `${corsAnywhereUrl}${originalUrl}`;
  const cacheKey = `${page}_${perPage}`;

  if (postsCache[cacheKey]) {
    return postsCache[cacheKey];
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (sliderErrorMessage) {
      sliderErrorMessage.style.display = "none";
    }

    const posts = await response.json();
    const totalPosts = parseInt(response.headers.get("X-WP-Total"));
    const totalPages = Math.ceil(totalPosts / perPage);

    postsCache[cacheKey] = { posts, totalPages };
    return { posts, totalPages };
  } catch (error) {
    console.error("Error fetching posts for slider:", error);
    if (sliderErrorMessage) {
      sliderErrorMessage.textContent =
        "Oops! Something went wrong while fetching the latest posts. It could be a temporary issue with our server or your internet connection. Please try again later, and if the problem continues, our site might be undergoing maintenance.";
      sliderErrorMessage.style.display = "block";
    }

    toggleArrowsDisplay("none");
  }
}

// ---------- Create Post Element Function ----------//
//Creates and returns sliderpost element based on post data
function createSliderPostElement(post) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content.rendered, "text/html");
    const image = doc.querySelector("img");
    const imageUrl = image ? image.src : "";
    const imageAlt = image ? image.alt : "";

    const article = document.createElement("article");
    article.className = "article-latest text-left slider-post";
    article.innerHTML = `
            <a href="/html/recipe.html?post_id=${post.id}" aria-label="Read more about ${post.title.rendered}">
                <img class="zoom-img img-small" src="${imageUrl}" alt="${imageAlt}">
                <h3 class="article-header">${post.title.rendered}</h3>
                <p class="article-text latest-top-text">Category: ${post["category-value"]}</p>
                <p class="article-text latest-bot-text">Origin: ${post["origin-value"]}</p>
                <div class="cta-layout">READ MORE</div>
            </a>
        `;
        if (sliderPostErrorMessage) {
            sliderPostErrorMessage.style.display = "none";
          }
    return article;
  } catch (error) {
    console.error("Error creating slider post element:", error);
    if (sliderPostErrorMessage) {
        sliderPostErrorMessage.textContent =
        "We're having a bit of trouble showcasing this recipe right now. Please browse our other delicious recipes while we get this sorted!";
        sliderPostErrorMessage.style.display = "block";
    }
    toggleArrowsDisplay("none");
  }
}

// ---------- Load and Display Posts Function ----------//
//Load and display posts in the slider for the spcified page
async function loadSliderPosts(page) {
  if (loaderSlider) {
    loaderSlider.classList.remove("hidden");
  }
  toggleArrowsDisplay("none");
//   await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const leftArrowContainer = document.querySelector(".left-arrow-container");
    const rightArrowContainer = document.querySelector(
      ".right-arrow-container"
    );
    toggleArrowsDisplay("block");
    const sliderContainer = document.querySelector(".posts-container");

    const perPage = getPostsPerPage();
    const { posts, totalPages: newTotalPages } = await fetchSliderPosts(
      page,
      perPage
    );
    totalPages = newTotalPages;

    // Clear existing posts
    const postElements = sliderContainer.querySelectorAll(".slider-post");
    postElements.forEach((el) => el.remove());

    sliderContainer.insertBefore(
      leftArrowContainer,
      sliderContainer.firstChild
    );

    if (posts && posts.length > 0) {
      posts.forEach((post) => {
        const articleElement = createSliderPostElement(post);
        sliderContainer.appendChild(articleElement);
      });

      document.querySelector(".left").style.opacity = page > 1 ? "1" : "0.3";
      document.querySelector(".right").style.opacity =
        page < totalPages ? "1" : "0.3";
    } else {
      document.querySelector(".right").style.opacity = "0.3";
    }

    sliderContainer.appendChild(rightArrowContainer);
  } catch (error) {
    console.error("Error loading slider posts:", error);
    if (sliderErrorMessage) {
      sliderErrorMessage.textContent =
        "Oops! There was an issue loading the latest posts. It might be due to a connectivity problem or a temporary glitch. Please check your internet connection and try again. If the problem persists, our website could be undergoing maintenance.";
    }
    toggleArrowsDisplay("none");
  } finally {
    // Hide the loader after posts are loaded or in case of an error
    if (loaderSlider) {
      loaderSlider.classList.add("hidden");
    }
  }
}

// ---------- Event Listeners ----------//
//For slider navigation adn window resizing
document
  .querySelector(".left-arrow-container .left")
  .addEventListener("click", () => {
    if (sliderPage > 1) {
      sliderPage--;
      loadSliderPosts(sliderPage);
    }
  });

document
  .querySelector(".right-arrow-container .right")
  .addEventListener("click", async () => {
    if (sliderPage < totalPages) {
      sliderPage++;
      loadSliderPosts(sliderPage);
    }
  });

window.addEventListener(
  "resize",
  debounce(() => loadSliderPosts(sliderPage), 250)
);

// ---------- Initial Load ----------//
document.addEventListener("DOMContentLoaded", () => {
  loadSliderPosts(sliderPage);
});

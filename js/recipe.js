//---------- API, recipe content and similarDish content-------------//

// Get the post_id from the query string
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("post_id");

//---------- Fetch -------------//

//---- This function fetch a specific post by post_id
async function fetchPostById(postId) {
  const corsAnywhereUrl = "https://noroffcors.onrender.com/";
  const originalUrl = `https://james-smith.cmsbackendsolutions.com/wp-json/wp/v2/posts/${postId}?_embed`;

  const url = corsAnywhereUrl + originalUrl;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const post = await response.json();
  return post;
}

//---- This function fetch with url to get similar dishes based on the category. it use categoruId to get similar dishes(category) and expludePostId removes the current post from the flow.
async function fetchSimilarDishes(categoryId, excludePostId) {
  const url = `https://james-smith.cmsbackendsolutions.com/wp-json/wp/v2/posts?categories=${categoryId}&per_page=4&exclude=${excludePostId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch similar dishes");
  }
  return response.json();
}

//---------- Create -------------//

// This function create similar dishes. image, title, and notes values.
function createSimilarDishesElements(similarDishes) {
  const container = document.querySelector(".simular-container .posts");
  container.innerHTML = "";

  similarDishes.forEach((dish) => {
    // Parsing the content for each similar dish
    const parser = new DOMParser();
    const doc = parser.parseFromString(dish.content.rendered, "text/html");

    const image = doc.querySelector("img");
    const imageUrl = image ? image.src : "";
    const imageAlt = image ? image.alt : "";

    const article = document.createElement("article");
    article.className = "post";
    article.innerHTML = `
            <a href="/html/recipe.html?post_id=${dish.id}" class="a-post box-shadow">
                <img class="img-small block" src="${imageUrl}" alt="${imageAlt}">
                <h3 class="h3-post">${dish.title.rendered}</h3>
                <div class="hover-content text-left">
                <p class="flex space-between">
                MY RATING:
                <span class="rating-value">${dish["rating-value"]}<i class="fa-solid fa-heart"></i></span>
              </p>
              <p class="flex space-between">
                DIFFICULTY: <span class="difficulty-value">${dish["difficulty-value"]}</span>
              </p>
              <p class="flex space-between">
                TIME: <span class="time-value">${dish["time-value"]}</span>
              </p>
              <p class="flex space-between">
                CATEGORY: <span class="category-value">${dish["category-value"]}</span>
              </p>
              <p class="flex space-between">
                TYPE: <span class="type-value">${dish["type-value"]}</span>
              </p>
              <p class="flex space-between">
                ORIGIN: <span class="origin-value">${dish["origin-value"]}</span>
              </p>
                </div>
            </a>
        `;
    container.appendChild(article);
  });
}

// Function to create recipe elements with post data. title, ingredeints, instructions, and iamge.
function createRecipeElements(post) {
  const recipeTitle = document.querySelector(".dish");
  const ingredientList = document.getElementById("ingredient-list");
  const instructionsList = document.getElementById("recipe-instructions");
  const figureContainer = document.querySelector(".content-img");

  recipeTitle.textContent = post.title.rendered;

  ingredientList.innerHTML = "";
  instructionsList.innerHTML = "";

  // Parsing the content
  const parser = new DOMParser();
  const contentDoc = parser.parseFromString(post.content.rendered, "text/html");

  // Making variables for WP REST API elements
  const ingredients = contentDoc.querySelector("ul");
  if (ingredients) {
    ingredientList.innerHTML = ingredients.innerHTML;
  }

  const instructions = contentDoc.querySelector("ol");
  if (instructions) {
    instructionsList.innerHTML = instructions.innerHTML;
  }

  // removing classes from WP REST API and add my own
  const figure = contentDoc.querySelector("figure");
  if (figure) {
    figure.classList.remove("wp-block-image", "size-full");

    const imgElement = figure.querySelector("img");
    if (imgElement) {
      imgElement.classList.remove("wp-image-62");
      imgElement.classList.add("w-100", "block");
    }

    const figcaption = figure.querySelector("figcaption");
    if (figcaption) {
      figcaption.classList.add("visually-hidden");
    }

    figureContainer.innerHTML = "";
    figureContainer.appendChild(figure);
  }

  //adding notes with querySelector
  const ratingValueElement = document.querySelector(".rating-value");
  ratingValueElement.textContent = post["rating-value"];

  const heartIcon = document.createElement("i");
  heartIcon.className = "fas fa-heart";

  ratingValueElement.appendChild(heartIcon);

  document.querySelector(".difficulty-value").textContent =
    post["difficulty-value"];
  document.querySelector(".time-value").textContent = post["time-value"];
  document.querySelector(".category-value").textContent =
    post["category-value"];
  document.querySelector(".type-value").textContent = post["type-value"];
  document.querySelector(".origin-value").textContent = post["origin-value"];
}

//---------- Fetch and Create-------------//

//---- This function loads and display recipe page. it fetch main recipe post by ID, creates element for the details, and fetches and displays 3 similar dishes(category)
async function loadRecipe() {
  try {
    if (postId) {
      const post = await fetchPostById(postId);
      createRecipeElements(post);

      const categoryId = post.categories[0];
      if (categoryId) {
        const similarDishes = await fetchSimilarDishes(categoryId, postId);
        createSimilarDishesElements(
          similarDishes
            .filter((dish) => dish.id !== parseInt(postId))
            .slice(0, 3)
        );
      }
    }
  } catch (error) {
    console.error("Error loading recipe page:", error);
  }
}

loadRecipe();

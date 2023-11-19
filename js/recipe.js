//---------- API, recipe content and similarDish content-------------//

// Get the post_id from the query string
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("post_id");

//Error messages
const errorRecipeMessage = document.querySelector("#errorRecipeMessage");
const errorSimilarMessage = document.querySelector("#errorSimilarMessage");

//---------- Fetch -------------//

//---- This function fetch a specific post by post_id
async function fetchPostById(postId) {
  try {
    const corsAnywhereUrl = "https://noroffcors.onrender.com/";
    const originalUrl = `https://james-smith.cmsbackendsolutions.com/wp-json/wp/v2/posts/${postId}?_embed`;
    const url = corsAnywhereUrl + originalUrl;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching post by ID:", error);

    throw error;
  }
}

//---- This function fetch with url to get similar dishes based on the category. it use categoruId to get similar dishes(category) and expludePostId removes the current post from the flow.
async function fetchSimilarDishes(categoryId, excludePostId) {
  try {
    const url = `https://james-smith.cmsbackendsolutions.com/wp-json/wp/v2/posts?categories=${categoryId}&per_page=4&exclude=${excludePostId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch similar dishes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching similar dishes:", error);

    throw error;
  }
}

//---------- Create -------------//

// This function creates similar dishes elements: image, title, and notes values.
function createSimilarDishesElements(similarDishes) {
  try {
    const container = document.querySelector(".simular-container .posts");
    container.innerHTML = "";

    similarDishes.forEach((dish) => {
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
  } catch (error) {
    console.error("Error displaying similar dishes:", error);
    errorSimilarMessage.textContent =
      "Looks like our side dish recommendations are taking a little longer to simmer! While we sort that out, please enjoy the main recipe. Swing by a bit later for those extra tasty suggestions!";
  }
}

// Function to create recipe elements with post data. title, ingredeints, instructions, and iamge.
function createRecipeElements(post) {
  try {
    const recipeTitle = document.querySelector(".dish");
    const ingredientList = document.getElementById("ingredient-list");
    const instructionsList = document.getElementById("recipe-instructions");
    const figureContainer = document.querySelector(".content-img");

    recipeTitle.textContent = post.title.rendered;

    ingredientList.innerHTML = "";
    instructionsList.innerHTML = "";

    // Parsing the content
    const parser = new DOMParser();
    const contentDoc = parser.parseFromString(
      post.content.rendered,
      "text/html"
    );

    // Making variables for WP REST API elements
    const ingredients = contentDoc.querySelector("ul");
    if (ingredients) {
      ingredientList.innerHTML = ingredients.innerHTML;
    }

    const instructions = contentDoc.querySelector("ol");
    if (instructions) {
      instructionsList.innerHTML = instructions.innerHTML;
    }

    // Removing classes from WP REST API and add my own
    const figure = contentDoc.querySelector("figure");
    if (figure) {
      figure.classList.remove("wp-block-image", "size-full");

      const imgElement = figure.querySelector("img");
      if (imgElement) {
        imgElement.classList.remove("wp-image-62");
        imgElement.classList.add("w-100", "block", "recipe-img");
        //Event Listner for bigger img on click
        imgElement.addEventListener("click", function () {
          openModal(this.src);
        });
      }

      const figcaption = figure.querySelector("figcaption");
      if (figcaption) {
        figcaption.classList.add("visually-hidden");
      }

      figureContainer.innerHTML = "";
      figureContainer.appendChild(figure);
    }

    //This function set the makes the first letter the string to uppercase, and the rest to lowercase. it will also change the title to the titleId of the post.
    function capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    document.title = `James Cook | ${capitalizeFirstLetter(
      post.title.rendered
    )}`;

    //Adding notes with querySelector
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
  } catch (error) {
    console.error("Error displaying the recipe:", error);
    errorRecipeMessage.textContent =
      "We've fetched the recipe but are having trouble displaying it right now. Please refresh the page or try again later. Feel free to check out similar dishes below";
  }
}
// This function opens the modal to display the recipe img bigger also close the modal when click outside imagemodal or closeIcon.
function openModal(src) {
  var modal = document.getElementById("imageModal");
  var modalImg = document.getElementById("enlargedImage");

  modal.style.display = "block";
  modalImg.src = src;

  window.onclick = function (event) {
    var modal = document.getElementById("imageModal");

    if (
      event.target == modal ||
      event.target.classList.contains("close") ||
      event.target.parentElement.classList.contains("close")
    ) {
      modal.style.display = "none";
    }
  };
}

//---------- Fetch and Create-------------//

//---- This function loads and display recipe page. it fetch main recipe post by ID, creates element for the details, and fetches and displays 3 similar dishes(category)
async function loadRecipe() {
  let recipeLoaded = false;
  let similarDishesLoaded = false;

  try {
    if (postId) {
      document.getElementById("loaderRecipe").classList.remove("hidden");

      const post = await fetchPostById(postId);
      createRecipeElements(post);
      recipeLoaded = true;

      document.getElementById("loaderRecipe").classList.add("hidden");
      const categoryId = post.categories[0];
      if (categoryId) {
        document.getElementById("loaderSimilar").classList.remove("hidden");

        const similarDishes = await fetchSimilarDishes(categoryId, postId);
        createSimilarDishesElements(
          similarDishes
            .filter((dish) => dish.id !== parseInt(postId))
            .slice(0, 3)
        );
        similarDishesLoaded = true;

        document.getElementById("loaderSimilar").classList.add("hidden");
      }
    }
  } catch (error) {
    console.error("Error loading recipe page:", error);
    if (!recipeLoaded) {
      errorRecipeMessage.textContent =
        "Oops! We're having trouble serving up this recipe right now. Please refresh the page or try again later. We're working to get everything back to the kitchen as soon as possible!";
      document.getElementById("loaderRecipe").classList.add("hidden");
    } else if (!similarDishesLoaded) {
      errorSimilarMessage.textContent =
        "Just a heads up: We managed to fetch the recipe, but we're having a bit of trouble loading suggestions for similar dishes. Feel free to enjoy the recipe, and check back later for more culinary inspirations!";
      document.getElementById("loaderSimilar").classList.add("hidden");
    }
  }
}

loadRecipe();


//----------COMMENT FORM-------------//
document.getElementById('commentForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = {
      author_name: document.getElementById('commentName').value,
      content: document.getElementById('commentContent').value,
      post: postId
  };

  try {
      const response = await fetch('https://james-smith.cmsbackendsolutions.com//wp-json/wp/v2/comments', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Comment submitted:', data);
      // Handle success - maybe clear the form or show a success message
  } catch (error) {
      console.error('Error posting comment:', error);
      // Handle errors, maybe display a message to the user
  }
});

function displayComments(comments) {
  const commentsContainer = document.getElementById("commentsContainer");
  commentsContainer.innerHTML = ""; // Clear existing comments

  comments.forEach(comment => {
    const commentElement = document.createElement("div");
    commentElement.className = "comment";
    commentElement.innerHTML = `
      <p class="comment-author">${comment.author_name}</p>
      <p class="comment-content">${comment.content.rendered}</p>
    `;
    commentsContainer.appendChild(commentElement);
  });
}
# James-Smith-food-blog-
School project HTML/CSS/JS/HeadlessCMS

- h1 for brand name and logo on every page bcs of text size hierarchy

-i used some styles in global several times,(not DRY) bcs there was some content that i used on all of my pages, and in that way i didnt have to put on to many classes to the elements. 

- some class styles are repetative, but i kept the same class name for consistency. i didnt want to make them on global when they were on only two pages.

- some styles are the same on different pages like the arrow button, but bcs index and posts css page both have some lines, i chose to just repeat myself on some classes insted of link both css sheet to both html. 

- when creating elements after fetching from Rest API i chose to use template strings to embed expressions and varibles with strings using ${}. in the recipe.js i relized that  after fetching the Rest api i got elements from Wordpress, and i had to remove and add classes insted of parsing out all the text from the elements. (like i did some places.)

- Fetch REST API: i could re-use the recipe function fetchPosts and use it on the index page for the slider, but since i didnt need the filter and sortBy, and also needed logic for the arrows i decided to fetch the api again on the index page. 

- JS i could also organaize my project with several JS sheets to make it more maintanable, and i would have done that if the project was bigger. but i feel in a small project like this, having the js (less organiazed) within lesser JS sheets is a good approuch for a small project like this. 

- error handling for fetch and DOMPars funcitons


sjekk comment for recipe page. og contact form for lagring av melding

 add loader. index 

 endre så hr blir lik over alle sider 


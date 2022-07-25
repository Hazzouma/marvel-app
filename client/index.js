/**
 *
 * These are my functions to be interacting directly with the DOM
 * Selecting DOM elements
 * Adding event listeners
 * Fetching Data...
 *
 * In Frontend and as a React developer and lover, I tried to follow some React logic
 * In my project, I am using Semantic UI as css framework, it helps me showing cards and displaying loaders
 * for more info, check this link: https://semantic-ui.com/introduction/getting-started.html
 */
const PUBLIC_URL = "http://localhost:4000";

//ui classes (Semantic classNames)
const loaderClassList = ["ui", "active", "centered", "inline", "loader"];
const cardClassList = ["ui", "fluid", "card"];
const errorClassList = ["ui", "medium", "header", "red"];

//states
let load_data = false;
let characters = [];
let pageNumber = 0;
let itemsPerPage = 10;
let allDataIsLoaded = false;

//DOM elements
const bigContainer = document.getElementById("bigContainer");
const marvelCharactersContainer = document.getElementById("marvelCharactersContainer");

/**
 * This function creates a node element.
 * @param {String} el : name of node element to be created.
 * @param {Array} classList : Array of classNames to be added to the node element.
 * @param {String} imgURL : if it is an img element, we insert imgURL as src.
 * @param {String} title : if it is p element, we insert title as innerText.
 * @returns node Element been created.
 */
const createNodeElement = (
  el,
  classList,
  imgURL = "https://usefulangle.com/img/thumb/javascript.png",
  title = "Hazem Housseini"
) => {
  const element = document.createElement(el);
  classList.forEach((className) => element.classList.add(className));
  if (el === "img") {
    element.setAttribute("src", imgURL);
    element.setAttribute("alt", "Photo of Marvel character");
  } else if (el === "p") {
    element.innerText = title;
  }
  return element;
};

/**
 * 
 * This function creates a column which will have as a child the card of marvel's character
 * this is the HTML snippet of the card being created by this function
 * 
    <div class="column">
        <div class="ui fluid card">
        <div class="image">
            <img src="" alt="" />
        </div>
        <div class="content">
            <p class="header">Character Name</p>
        </div>
        </div>
    </div>
 */
function createMarvelCharacterCard(imgURL, title) {
  //creating outer 2 divs
  const column = createNodeElement("div", ["column"]);
  const card = createNodeElement("div", cardClassList);

  //adding img and p as children
  //creating img element
  const imgElement = createNodeElement("img", [], imgURL);
  const imgContainer = createNodeElement("div", ["image"]);
  imgContainer.appendChild(imgElement);

  //creating p element
  const titleElement = createNodeElement("p", ["header"], "", title);
  const titleContainer = createNodeElement("div", ["content"]);
  titleContainer.appendChild(titleElement);

  //appending to outer divs
  card.appendChild(imgContainer);
  card.appendChild(titleContainer);
  column.appendChild(card);

  return column;
}

//dispatch action that fetches data
const fetchData = async (page) => {
  try {
    let res = await (await fetch(`${PUBLIC_URL}/api/users/` + page)).json();
    return res;
  } catch (error) {
    return { error: error.message };
  }
};

//Fetch data to backend
async function getMarvelCharacters() {
  //show loader
  load_data = true;
  bigContainer.appendChild(createNodeElement("div", loaderClassList));
  const loader = document.querySelector(".loader");

  //fetch data if all data is not reached
  const res = !allDataIsLoaded ? await fetchData(pageNumber) : {};

  loader.remove();

  //handle response
  if (res.error?.length) {
    const errorElement = createNodeElement("p", errorClassList, "", "Something went wrong!");
    bigContainer.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 3000);
  }
  if (res.data?.results) {
    const characters = res.data.results;
    characters.forEach((char, i) =>
      marvelCharactersContainer.appendChild(
        createMarvelCharacterCard(char.thumbnail.path + "." + char.thumbnail.extension, char.name)
      )
    );
    pageNumber++;

    //check if all data is loaded
    if (res.data.total < pageNumber * itemsPerPage) allDataIsLoaded = true;
  }
  load_data = false;
}

//when window loads first time
window.onload = async (e) => {
  await getMarvelCharacters();
};

//when scrolling load more data
window.onscroll = async (e) => {
  // if we reach bottom of page - 2px, we fetch new data
  // we skip first window.onload in order to avoid fetching data twice
  if (!load_data && pageNumber !== 0 && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2)
    await getMarvelCharacters();
};

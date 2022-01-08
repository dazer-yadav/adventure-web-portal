import config from "../conf/index.js";
let cities;
async function init() {
  //Fetches list of all cities along with their images and description
  try {
    cities = await fetchCities();
    //Updates the DOM with the cities
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  } catch (e) {
    console.log(new Error("Something went wrong"));
  }
}

//Implementation of fetch call
async function fetchCities() {
  // 1. Fetch cities using the Backend API and return the data
  try {
    let res = await fetch(config.backendEndpoint + "/cities");
    let data = await res.json();
    return data;
  } catch (e) {
    console.log(new Error("Server down"));
    return null;
  }
}

/* Filter cities on search */
let input = document.getElementById("input-search");
input.addEventListener("keyup", function (e) {
  let val = e.target.value;
  let filteredCity = cities.filter((item) => item.id.includes(val));
  let cityRef = document.getElementById("data");
  cityRef.innerHTML = "";
  filteredCity.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
});

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // 1. Populate the City details and insert those details into the DOM
  let data = document.getElementById("data");
  let div = document.createElement("div");
  div.className = "tile";
  let img = document.createElement("img");
  let src = document.createAttribute("src");
  src.value = image;
  let alt = document.createAttribute("alt");
  alt.value = city;
  img.setAttributeNode(src);
  img.setAttributeNode(alt);
  let a = newNode("a");
  a.setAttribute("href", "pages/adventures/?city=" + id);
  a.appendChild(img);
  div.appendChild(a);
  let h1 = document.createElement("h3");
  h1.innerText = city;
  let p = document.createElement("p");
  p.innerText = description;
  let innerDiv = document.createElement("div");
  innerDiv.className = "tile-text";
  innerDiv.appendChild(h1);
  innerDiv.appendChild(p);
  div.appendChild(innerDiv);
  data.appendChild(div);
}

function newNode(element) {
  return document.createElement(element);
}
export { init, fetchCities, addCityToDOM };

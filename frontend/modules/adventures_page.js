import config from "../conf/index.js";
let fullList;
//Implementation to extract city from query params
function getCityFromURL(search) {
  // 1. Extract the city id from the URL's Query Param and return it
  return search.split("=")[1];
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // 1. Fetch adventures using the Backend API and return the data
  try {
    let res = await fetch(config.backendEndpoint + "/adventures?city=" + city);
    let data = await res.json();
    fullList = data;
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // 1. Populate the Adventure Cards and insert those details into the DOM
  let adventureRow = document.getElementById("data");
  adventureRow.innerHTML = "";
  adventures.forEach((adventure) => {
    let a = document.createElement("a");
    a.setAttribute("href", "detail/?adventure=" + adventure.id);
    a.setAttribute("id", adventure.id);
    a.style.display = "block";
    a.className = "col-md-6 col-lg-3 mb-3";

    let outerDiv = document.createElement("div");
    outerDiv.classList.add("activity-card");

    let img = document.createElement("img");
    img.setAttribute("src", adventure.image);
    img.setAttribute("alt", adventure.name);
    outerDiv.appendChild(img);

    let banner = document.createElement("div");
    banner.className = "category-banner";
    banner.innerText = adventure.category;
    outerDiv.appendChild(banner);

    let innerDiv = document.createElement("div");
    //innerDiv.className="d-flex";
    innerDiv.style.width = "100%";
    let innerHTML = `
        <div style="width: 100%;display: flex;justify-content: space-between;" class="px-4">
          <p>${adventure.name}</p>
          <p>${adventure.costPerHead}</p>
        </div>
        <div style="width: 100%;display: flex;justify-content: space-between;"  class="px-4">
          <p>Duration</p>
          <p>${adventure.duration + " Hours"}</p>
        </div>
      `;

    innerDiv.innerHTML = innerHTML;
    outerDiv.appendChild(innerDiv);
    a.appendChild(outerDiv);
    //a.classList.add('m-1','activity-links')
    adventureRow.appendChild(a);
  });
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  console.log("by duration");
  low = parseInt(low);
  high = parseInt(high);
  if (isNaN(low) || isNaN(high)) {
    return list;
  }
  let filteredAdventures = list.filter((item) => {
    return (
      parseInt(item.duration) >= low &&
      parseInt(item.duration) <= parseInt(high)
    );
  });
  return filteredAdventures;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  //console.log(list,categoryList);
  return list.filter((item) => categoryList.includes(item.category));
}

function filterFunction(list, filters) {
  // Place holder for functionality to work in the Stubs
  let filteredList = [];
  if (filters.duration != "") {
    if (!Array.isArray(filters.duration)) {
      filters.duration = filters.duration.split("-");
    }
  }
  console.log(filters);
  if (filters.category.length != 0 && filters.duration != "") {
    let low = parseInt(filters.duration[0]);
    let high = parseInt(filters.duration[1]);
    let categories = filters.category;
    list.forEach((item) => {
      let duration = parseInt(item.duration);
      if (
        categories.includes(item.category) &&
        duration >= low &&
        duration <= high
      ) {
        filteredList.push(item);
      }
    });
  } else {
    if (filters.category.length == 0 && filters.duration == "") {
      addAdventureToDOM(list);
      return list;
    }
    if (filters.category.length == 0) {
      let low = parseInt(filters.duration[0]);
      let high = parseInt(filters.duration[1]);
      filteredList = filterByDuration(list, low, high);
    } else {
      filteredList = filterByCategory(list, filters.category);
    }
  }
  addAdventureToDOM(filteredList);
  return filteredList;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  let filter = localStorage.getItem("filters");
  filter = JSON.parse(filter);
  return filter;
}

function generateFilterPillsAndUpdateDOM(filters) {
  filters.category.forEach((value) => {
    let div = document.createElement("div");
    div.className = "category-filter";
    div.innerText = value;
    let span = document.createElement("span");
    span.innerText = "X";
    span.style.paddingLeft = "10px";
    span.setAttribute("id", value);
    span.style.color = "red";
    span.style.cursor = "pointer";
    span.addEventListener("click", (e) => {
      let id = e.target.id;
      console.log(id);
      filters.category = filters.category.filter((cat) => cat != id);
      div.remove();
      console.log(filters);
      let list = filterFunction(fullList, filters);
      addAdventureToDOM(list);
    });
    div.appendChild(span);
    // div.setAttribute('id',value);
    pills.appendChild(div);
  });
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};

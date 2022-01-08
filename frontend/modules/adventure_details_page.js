import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());
  // Place holder for functionality to work in the Stubs
  return params.adventure;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  try {
    let res = await fetch(
      config.backendEndpoint + "/adventures/detail?adventure=" + adventureId
    );
    let adventure = await res.json();
    return adventure;
  } catch (e) {
    console.log(new Error(e));
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  document.getElementById("adventure-name").innerHTML = adventure.name;
  document.getElementById("adventure-subtitle").innerHTML = adventure.subtitle;
  let photoId = document.getElementById("photo-gallery");
  adventure.images.forEach((image) => {
    let div = document.createElement("div");
    let img = document.createElement("img");
    img.setAttribute("src", image);
    img.setAttribute("alt", "check");
    // div.style.backgroundImage = `url(${image})`
    img.className = "activity-card-image";
    div.style.width = "100%";
    div.style.height = "500px";
    div.appendChild(img);
    photoId.appendChild(div);
  });
  document.getElementById("adventure-content").innerText = adventure.content;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  let photoId = document.getElementById("photo-gallery");
  let inner = document.createElement("div");
  inner.classList.add("carousel-inner");
  // Unordered List
  let ol = document.createElement("ol");
  ol.className = "carousel-indicators";
  images.forEach((image, i) => {
    let li = document.createElement("li");
    li.setAttribute("data-target", "#carouselExampleIndicators");
    li.setAttribute("data-slide-to", i);
    //
    let div = document.createElement("div");
    div.className = "carousel-item";
    if (i == 0) {
      div.classList.add("carousel-item", "active");
      li.className = "active";
    }
    let img = document.createElement("img");
    img.classList.add("d-block", "w-100", "activity-card-image");
    img.setAttribute("src", image);
    img.setAttribute("alt", "check");
    div.appendChild(img);
    inner.appendChild(div);
    ol.appendChild(li);
  });
  // Outer Carousel
  let outerCarousel = document.createElement("div");
  outerCarousel.classList.add("carousel", "slide");
  outerCarousel.setAttribute("data-ride", "carousel");
  outerCarousel.setAttribute("id", "carouselExampleIndicators");
  outerCarousel.appendChild(ol);
  // Slide buttons
  let previous = getSlideButtons(
    "carousel-control-prev",
    "prev",
    "carousel-control-prev-icon",
    "Previous"
  );
  let next = getSlideButtons(
    "carousel-control-next",
    "next",
    "carousel-control-next-icon",
    "Next"
  );

  outerCarousel.appendChild(inner);
  outerCarousel.appendChild(previous);
  outerCarousel.appendChild(next);
  photoId.innerHTML = "";
  photoId.appendChild(outerCarousel);
}
function getSlideButtons(classname, slide, spanclass, spantext) {
  let a = document.createElement("a");
  a.className = classname;
  a.setAttribute("href", "#carouselExampleIndicators");
  a.setAttribute("role", "button");
  a.setAttribute("data-slide", slide);
  let span1 = document.createElement("span");
  span1.className = spanclass;
  span1.setAttribute("aria-hidden", "true");
  let span2 = document.createElement("span");
  span2.className = "sr-only";
  span2.innerText = spantext;
  a.appendChild(span1);
  a.appendChild(span2);
  return a;
}
//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  let soldPanel = document.getElementById("reservation-panel-sold-out");
  let reservationPanel = document.getElementById("reservation-panel-available");
  let codeId = document.getElementById("reservation-person-cost");
  if (adventure.available) {
    soldPanel.style.display = "none";
    reservationPanel.style.display = "block";
    codeId.innerHTML = adventure.costPerHead;
  } else {
    soldPanel.style.display = "block";
    reservationPanel.style.display = "none";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  persons = parseInt(persons);
  let cost = persons * adventure.costPerHead;
  document.getElementById("reservation-cost").innerHTML = cost;
}

function captureFormSubmit(adventure) {
  let form = document.getElementById("myForm");
  console.log(adventure);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let formElements = form.elements;
    console.log(formElements["date"]);
    try {
      let formData = {
        name: formElements["name"].value,
        date: new Date(formElements["date"].value),
        person: formElements["person"].value,
        adventure: adventure.id,
      };
      fetch(config.backendEndpoint + "/reservations/new", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => {
        console.log(res);
        if (res.ok) {
          alert("Success!");
        } else {
          alert("Failed!");
        }
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  if (adventure.reserved) {
    document.getElementById("reserved-banner").style.display = "block";
  } else {
    document.getElementById("reserved-banner").style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};

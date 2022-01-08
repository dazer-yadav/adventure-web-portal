import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // 1. Fetch Reservations by invoking the REST API and return them
  try {
    let res = await fetch(config.backendEndpoint + "/reservations/");
    let data = await res.json();
    return data;
  } catch (e) {
    console.log(new Error(e));
    return null;
  }

  // Place holder for functionality to work in the Stubs
  return null;
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table
  console.log(reservations);
  let table = document.getElementById("reservation-table");
  //Conditionally render the no-reservation-banner and reservation-table-parent
  if (reservations.length == 0) {
    document.getElementById("reservation-table-parent").style.display = "none";
    document.getElementById("no-reservation-banner").style.display = "block";
  } else {
    document.getElementById("reservation-table-parent").style.display = "block";
    document.getElementById("no-reservation-banner").style.display = "none";
  }
  reservations.map((item) => {
    let tr = document.createElement("tr");
    let url = "../detail/?adventure=" + item.adventure;
    let inside = `
      <td scope="row">${item.id}</td>
      <td>${item.name}</td>
      <td>${item.adventureName}</td>
      <td>${item.person}</td>
      <td>${new Date(item.date).toLocaleDateString("en-IN")}</td>
      <td>${item.price}</td>
      <td>${secondDate(item.time)}</td>
      <td><button class="reservation-visit-button" id=${
        item.id
      }><a href=${url}>Visit Adventure</a></button></td>
    `;
    tr.innerHTML = inside;
    table.appendChild(tr);
  });
}

function secondDate(val) {
  let date = new Date(val);
  return (
    date.getDate() +
    " " +
    date.toLocaleDateString("default", { month: "long" }) +
    " " +
    date.getFullYear() +
    ", " +
    date.toLocaleTimeString("en-IN")
  );
}

export { fetchReservations, addReservationToTable };

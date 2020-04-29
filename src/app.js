import { http } from "./easyhttp";

const movieOptions = document.getElementById("movie-option");
const roomContainer = document.querySelector(".room-container");
const unoccupiedSeats = [
  ...document.querySelectorAll(".row .seat:not(seat-occupied)")
];
const numOfSeatsSelectedElement = document.getElementById(
  "number-of-seats-selected"
);
const priceOfSeatsSelectedElement = document.getElementById(
  "price-of-seats-selected"
);

let ticketPrice = 0;

function storeSelectedSeats(selectedSeats) {
  localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
}

function retrieveSelectedSeats() {
  return JSON.parse(localStorage.getItem("selectedSeats"));
}

function storeSelectedMovieId(selectedMovieId) {
  localStorage.setItem("selectedMovieId", JSON.stringify(selectedMovieId));
}

function retrieveSelectedMovieId() {
  return JSON.parse(localStorage.getItem("selectedMovieId"));
}

function setUpMovies(movies) {
  movies.forEach(movie => {
    const optionElement = document.createElement("option");
    optionElement.value = movie.price;
    optionElement.id = `movie-id-${movie.id}`;
    optionElement.textContent = `${movie.name} (£${movie.price})`;
    movieOptions.appendChild(optionElement);
  });

  ticketPrice = parseInt(movies[0].price, 10);
}

function updateNumberOfSeatsSelected(seatsSelected) {
  numOfSeatsSelectedElement.innerText = seatsSelected;
}

function updateCostOfSeatsSelected(cost) {
  priceOfSeatsSelectedElement.innerText = cost;
}

function update() {
  const selectedSeats = document.querySelectorAll(".row .seat.seat-selected");
  const selectedNumOfSeats = selectedSeats.length;

  const seatsIndex = [...selectedSeats].map(seatElement =>
    unoccupiedSeats.indexOf(seatElement)
  );
  storeSelectedSeats(seatsIndex);

  updateNumberOfSeatsSelected(selectedNumOfSeats);
  updateCostOfSeatsSelected(ticketPrice * selectedNumOfSeats);
}

function handleSeatClicked(event) {
  event.preventDefault();

  if (
    event.target.classList.contains("seat") &&
    !event.target.classList.contains("seat-occupied")
  ) {
    event.target.classList.toggle("seat-selected");
    event.target.classList.toggle("seat-available");
    update();
  }
}

function handleMovieSelected(event) {
  event.preventDefault();

  ticketPrice = parseInt(movieOptions.value, 10);
  const movieElementId = movieOptions.options[movieOptions.selectedIndex].id;
  const movieId = movieElementId.replace("movie-id-", "");
  storeSelectedMovieId(movieId);
  update();
}

function setUpPreviouslySelectedMovie() {
  const selectedMovieId = retrieveSelectedMovieId();
  if (selectedMovieId !== null) {
    [...movieOptions.children].forEach((movie, index) => {
      if (movie.id === `movie-id-${selectedMovieId}`) {
        movieOptions.selectedIndex = index;
        ticketPrice = movie.value;
      }
    });
  }
}

function setUpPreviouslySelectedSeats() {
  const selectedSeats = retrieveSelectedSeats();
  if (selectedSeats !== null) {
    for (let i = 0; i < unoccupiedSeats.length; i++) {
      if (selectedSeats.includes(i)) {
        unoccupiedSeats[i].classList.add("seat-selected");
      }
    }

    // could also do
    // unoccupiedSeats.forEach((seat, index) => {});
  }
}

function initialise() {
  http
    .get("http://localhost:3000/movies")
    .then(movies => setUpMovies(movies))
    .then(() => setUpPreviouslySelectedMovie())
    .then(() => setUpPreviouslySelectedSeats())
    .then(() => update())
    .catch(error => console.log(error));
}

initialise();

roomContainer.addEventListener("click", handleSeatClicked);
movieOptions.addEventListener("change", handleMovieSelected);

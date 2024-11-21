const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let timer;
let seconds = 0;

document.querySelector(".score").textContent = moves;
document.querySelector("#timer").textContent = seconds;

// Fetch cards data from JSON file
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data]; // Duplicate cards for pairs
    shuffleCards();
    generateCards();
  });

// Shuffle cards
function shuffleCards() {
  cards.sort(() => Math.random() - 0.5);
}

// Generate cards dynamically
function generateCards() {
  gridContainer.innerHTML = ""; // Clear grid
  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.name = card.name;
    cardElement.innerHTML = `
      <div class="front">
        <img src="./images/${card.image}" alt="${card.name}" class="front-image">
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  });
  resetGame(); // Reset moves and timer
}

// Flip card logic
function flipCard() {
  if (lockBoard || this === firstCard) return;
  this.classList.add("flipped");
  if (!firstCard) {
    firstCard = this;
    startTimer(); // Start timer on first flip
    return;
  }
  secondCard = this;
  moves++;
  document.querySelector(".score").textContent = moves;
  lockBoard = true;
  checkForMatch();
}

// Check if two cards match
function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
  if (document.querySelectorAll(".card.flipped").length === cards.length) {
    clearInterval(timer); // Stop timer on win
    alert(`You won in ${moves} moves and ${seconds} seconds!`);
  }
}

// Unflip unmatched cards
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Reset board state
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Start and reset timer
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    document.querySelector("#timer").textContent = seconds;
  }, 1000);
}

function resetGame() {
  moves = 0;
  seconds = 0;
  document.querySelector(".score").textContent = moves;
  document.querySelector("#timer").textContent = seconds;
  clearInterval(timer);
}

// New Game button
document.querySelector("#new-game").addEventListener("click", () => {
  shuffleCards();
  generateCards();
});

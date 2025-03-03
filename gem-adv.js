const intro = document.querySelector(".info");
const game = document.getElementById("game");
const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const display = document.getElementById("display-dice");
const restart = document.getElementById("restart-btn");
const gameMusic = new Audio("music/game-music.mp3");
const pandaMusic = new Audio("music/panda-music.mp3");
const bearMusic = new Audio("music/bear-music.mp3"); //to change later
const holeMusic = new Audio("music/hole-music.mp3");
const saucerMusic = new Audio("music/ufo-music.mp3");
const successMusic = new Audio("music/success.mp3");
const bearIcon = "🐻";
const pandaIcon = "🐼";
const holes = [43, 52, 75, 82, 95];
const saucerIcon = "🛸";
const totalSaucers = 4;

let higherBoxes = [
  26, 28, 32, 35, 38, 41, 44, 46, 48, 54, 57, 60, 63, 67, 70, 73, 78,
]; // Avoid holes and above 80

let score1 = 0; //total of player1
let score2 = 0; //total of player2

//hide info and show game
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    intro.classList.add("hidden");
    game.classList.remove("hidden");
    gameMusic.play();
    gameMusic.loop = true;
  }
});

//random numbers for UFO
function getSafeRandom() {
  let randomNum;
  do {
    randomNum = Math.trunc(Math.random() * 100) + 1;
  } while (holes.includes(randomNum) || randomNum > 80 || randomNum < 25);
  return randomNum;
}

function placeSaucers() {
  // Remove all previous saucers
  const prevSaucers = document.querySelectorAll(".saucer");
  prevSaucers.forEach((box) => {
    box.textContent = "";
    box.classList.remove("saucer");
  });

  const uniqueNumbers = new Set();
  while (uniqueNumbers.size < totalSaucers) {
    const randomNum = getSafeRandom();
    uniqueNumbers.add(randomNum);
  }

  uniqueNumbers.forEach((boxNumber) => {
    const box = document.getElementById(`box-${boxNumber}`);
    box.textContent = saucerIcon;
    box.classList.add("saucer");
  });
}
function diceRoll1() {
  let prevScore = score1;
  let prevBox = document.getElementById(`box-${prevScore}`);
  if (prevScore > 0 && prevBox && score1 !== score2) {
    // Check if score is greater than 0 and element with id  exists and prevent other player from'vanishing'
    prevBox.textContent = "";
  }

  pandaMusic.play();
  let dice = Math.trunc(Math.random() * 6) + 1;
  display.textContent = dice;
  score1 += dice;
  if (holes.includes(score1)) {
    let currentBox = document.getElementById(`box-${score1}`);
    currentBox.textContent = "🐼"; // Temporarily show player on the hole
    holeMusic.play();
    setTimeout(() => {
      currentBox.textContent = ""; // Remove from hole after delay
      let newScore = Math.trunc(Math.random() * (score1 - 1)) + 1; // Random lower box
      score1 = newScore;
      let newBox = document.getElementById(`box-${score1}`);
      newBox.textContent = "🐼";
    }, 500);
  }
  //game over
  if (score1 >= 100) {
    gameMusic.pause();
    successMusic.play();
    let announce = document.createElement("p");
    announce.setAttribute("class", "winner");
    document.body.replaceChild(announce, game);
    announce.textContent = "Mr. Panda 🐼 wins the 💎 !";
    return;
  }

  let newBox = document.getElementById(`box-${score1}`);
  newBox.textContent = "🐼";
  dice2.style.backgroundColor = "green"; //visual indicator for player to start
  dice1.style.backgroundColor = ""; //visual indicatot for player to switch
  //**Player should not be able to play twice. */
  dice1.disabled = true;
  dice2.disabled = false;
  checkSaucer(score1, pandaIcon); // Check if landed on saucer
  console.log(score1);
}
function diceRoll2() {
  let prevScore = score2;
  let prevBox = document.getElementById(`box-${prevScore}`);
  if (prevScore > 0 && prevBox && score1 !== score2) {
    // Check if score is greater than 0 and element exists
    prevBox.textContent = "";
  }
  bearMusic.play();
  let dice = Math.trunc(Math.random() * 6) + 1;
  display.textContent = dice;
  score2 += dice;
  if (holes.includes(score2)) {
    let currentBox = document.getElementById(`box-${score2}`);
    currentBox.textContent = "🐻"; // Temporarily show player on the hole
    holeMusic.play();
    setTimeout(() => {
      currentBox.textContent = ""; // Remove from hole after delay
      let newScore = Math.trunc(Math.random() * (score2 - 1)) + 1; // Random lower box
      score2 = newScore;
      let newBox = document.getElementById(`box-${score2}`);
      newBox.textContent = "🐻";
    }, 500);
  }
  if (score2 >= 100) {
    gameMusic.pause();
    successMusic.play();
    let announce = document.createElement("p");
    announce.setAttribute("class", "winner");
    document.body.replaceChild(announce, game);
    announce.textContent = "Mr.Bear 🐻 wins the 💎 !";
    return;
  }
  let newBox = document.getElementById(`box-${score2}`);
  newBox.textContent = "🐻";
  dice1.style.backgroundColor = "green";
  dice2.style.backgroundColor = "";
  dice2.disabled = true;
  dice1.disabled = false;
  checkSaucer(score2, bearIcon); // Check if landed on saucer

  console.log(score2);
}

dice1.addEventListener("click", diceRoll1);
dice2.addEventListener("click", diceRoll2);

//holes in 43, 52,75,82,95

// Run placeSaucers() every 10 seconds
setInterval(placeSaucers, 10000);

function checkSaucer(score, playerIcon) {
  let currentBox = document.getElementById(`box-${score}`);
  if (currentBox.classList.contains("saucer")) {
    console.log("Landed on saucer!");
    saucerMusic.play();
    currentBox.textContent = "";
    movePlayerToHigherBox(playerIcon, score);
  }
}

function movePlayerToHigherBox(player, score) {
  setTimeout(() => {
    let newBox = document.getElementById(`box-${newScore}`);
    newBox.textContent = player; // Move to new position
    let newScore;
    do {
      newScore = higherBoxes[Math.floor(Math.random() * higherBoxes.length)];
    } while (newScore === score); // Avoid same box

    let prevBox = document.getElementById(`box-${score}`);
    prevBox.textContent = ""; // Clear current position

    console.log(`${player} moved to ${newScore}`);
  }, 1000);
}

restart.addEventListener("click", function () {
  display.textContent = "";
  let prevScore1 = score1;
  let prevBox1 = document.getElementById(`box-${prevScore1}`);
  prevBox1.textContent = "";

  let prevScore2 = score2;
  let prevBox2 = document.getElementById(`box-${prevScore2}`);
  prevBox2.textContent = "";
  gameMusic.pause();
  gameMusic.currentTime = 0;
  ``;

  score1 = 0;
  score2 = 0;

  setTimeout(() => gameMusic.play(), 1000);
});
//putting background images in boxes;
for (let i = 1; i <= 100; i++) {
  let boxDeco = document.getElementById(`box-${i}`);
  if (i === 43 || i === 52 || i === 75 || i === 82 || i === 95) {
    boxDeco.style.cssText = `background-color: rgba(23, 94, 23, 0.61);
    background-image: url(pictures/hole.jpg);
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: -1;`;
  } else if (i === 1) {
    boxDeco.style.cssText = `
    background-image: url(pictures/BrickHouse.png);
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: contain;
    z-index: -1;
    `;
  } else if (i % 2 === 0) {
    boxDeco.style.cssText = `
    background-image: url(pictures/grass-tile-2.png);
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: contain;
    z-index: -1;
    `;
  } else {
    boxDeco.style.cssText = `
      background-image: url(pictures/grass-tile-3.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      z-index: -1;
      `;
  }
}

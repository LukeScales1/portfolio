
const AVAILABLE_CARDS = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-bicycle', 'fa-leaf', 'fa-bomb']
let deckOfCards = AVAILABLE_CARDS.concat(AVAILABLE_CARDS);

let moveCount = 0;  // < 15 = 3 stars; < 20 = 2 stars; >25 = 0 stars;
let score = 3;
let currentTargets = [];

let noOfPairs = 0;

let gameStart = false;

const container = document.querySelector('.container');
const moves = document.querySelector('.moves');
const timer = document.querySelector('.timer');
let time = 0;

const stars = document.getElementsByClassName('fa-star');
const cardElements = document.getElementsByClassName('card');

const modal = document.getElementById('modal');
const modalBackground = document.getElementById('modal-background');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');
const finalScore = document.getElementById('final-score');

function resetDeck() {
	// No matches on deck reset
	noOfPairs = 0;

	// Remove old fa icon and any open/show/match classes, reassign with new fa icons
	for (var i = cardElements.length - 1; i >= 0; i--) {
		let card = cardElements[i];
		let cardIcon = card.getElementsByTagName('i');
		cardIcon[0].classList = ['fa'];
		card.classList.remove('open', 'show', 'match');
		cardIcon[0].classList.add(deckOfCards[i]);
	};
};


function toggleStar(star) {
	star.classList.toggle('fa-star-o');
};

function updateTime() {
	++time;
	timer.textContent = time;
};


function updateRating() {
	moves.textContent = moveCount;

	// Reset the stars if game is reset
	if (moveCount === 0) {
		for (var i = stars.length - 1; i >= 0; i--) {
			stars[i].classList.remove('fa-star-o');
		};
	};

	// Update star rating as game progresses
	if (moveCount === 15) {
		toggleStar(stars[2]);
		score = 2;
	} else if (moveCount === 20) {
		toggleStar(stars[1]);
		score = 1;
	};

	// Project rubric asked for 1 star minimum

	// } else if (moveCount === 25) {
	// 	toggleStar(stars[0]);
	// 	score = 0;
	// }
};

// Function to lock in matches or return cards that don't match
function updateCards(cardsArray, match) {
	for (var i = cardsArray.length - 1; i >= 0; i--) {
		cardsArray[i].classList.remove('open', 'show');
		if (match) {
			cardsArray[i].classList.add('match');
		};
	};
};

function fadeIn() {
	backgroundOpacity += 0.005;
	modalBackground.style.opacity = backgroundOpacity;
};

function gameWon() {
	finalScore.textContent = score;
	finalMoves.textContent = moveCount;
	finalTime.textContent = time;
	clearInterval(timerIntervalId);

	modal.style.display = 'block';
	modalBackground.style.display = 'block';
	backgroundOpacity = 0.01;
	fadeIntervalId = setInterval(fadeIn, 12);
	setTimeout(function() {
		clearInterval(fadeIntervalId);
	}, 1200);
};

// Check if chosen pair of cards match
function matchCheck(targetArray) {
	updateRating();
	isMatch = false;
	cardOne = targetArray[0].innerHTML;
	cardTwo = targetArray[1].innerHTML;
	if (cardOne === cardTwo) {
		isMatch = true;
		++noOfPairs;
		if (noOfPairs === 8) {
			// Game won!
			gameWon();
		};
	};
	updateCards(targetArray, match=isMatch);

	// Remove cards from current guesses/card array, reset currentGuesses
	setTimeout(function() {
		currentTargets = [];
	}, 0);

};

// Function for showing cards and tracking number of cards shown - pass pair to matchCheck()
function show(target) {
	currentTargets.push(target);
	target.classList.add('open', 'show');
	// Pair of cards selected = 1 move of game, check for match
	if (currentTargets.length === 2 ) {
		moveCount += 1;
		setTimeout(function() {
			matchCheck(currentTargets)}, 800);
	};
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };
    return array;
};

function restart() {
		shuffle(deckOfCards);
		resetDeck();
		currentTargets = [];

		moveCount = 0;
		updateRating();

		clearInterval(timerIntervalId);
		time = 0;
		timer.textContent = time;
		gameStart = false;
};


shuffle(deckOfCards);
resetDeck();

updateRating();

container.addEventListener('click', function (evt) {
	const clickedClass = evt.target.className;

	if (clickedClass === 'modal-btn') {
		if (evt.srcElement.id === 'yes-btn') {
			restart();
		};
		// If no-btn just hide modal, also hide for yes-btn
		modal.style.display = 'none';
		modalBackground.style.display = 'none';
		modalBackground.style.opacity = 0;
	};

	if (clickedClass === 'fa fa-repeat') {
		restart();
	};
	// Only show 2 cards - if another card is clicked quickly after pair is selected, ignore
	if (clickedClass === 'card' && currentTargets.length < 2) {
		// If card clicked, game has started - start timer
		if (gameStart === false) {
			timerIntervalId = setInterval(updateTime, 1000);
			gameStart = true;
		};
		show(evt.target);
	};
});

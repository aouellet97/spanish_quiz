const menuDiv = document.getElementById('menu');
//delete above
const waitDiv = document.getElementById('wait');

const deckCreationDiv = document.getElementById('deck-creation');
const deckCreationContentDiv = document.getElementById('deck-creation-content');

const deckSizeDiv = document.getElementById("deck-size"); 
const deckSizeCardsDiv = document.getElementById("deck-size-cards"); 
const fullBtn = document.getElementById("ds-full-btn"); 
const halfBtn = document.getElementById("ds-half-btn"); 

const quizDiv = document.getElementById('quizDiv');
const deckDrogressionDiv = document.getElementById('deck-progression');
const correctPercentDiv = document.getElementById('correct-percent');
const EnglishWordDiv = document.getElementById('English-Word');
const quizImage = document.getElementById('quiz-image');
const resultDiv = document.getElementById('result');
const skipBtn = document.getElementById('skip-btn');
const answerSubmitBtn = document.getElementById('answer-submit-btn');
const inputForm = document.getElementById('input');
const nextBtn = document.getElementById('next-btn');

const endDiv = document.getElementById('end-results');
const scoreDiv = document.getElementById('score');
const badDiv = document.getElementById('bad-words');

let quizData
let htmlStrings

let selection = {selectedCategories: [], cards: 0, allCards: false, half: false}
let deck = null
let deckSize = 0
let missedCards = []
let wins = 0
let currentCard = null

let cardsNumber = 0


function show(div){
    div.classList.remove('hidden');
}

function hide(div){
    div.classList.add('hidden');
}


function resset(){
  selection = {selectedCategories: [], cards: 0, allCards: false, half: false}
  deck = null
  deckSize = 0
  missedCards = []
  wins = 0
  currentCard = null
}

function onReplay(){
  deck = null
  deckSize = 0
  missedCards = []
  wins = 0
  currentCard = null
  hide(endDiv);
  startQuiz()
}

function goHome(){
  resset();
  resetButtons();
  document.getElementById('card-number').innerHTML = `Deck Size: 0`;
  show(deckCreationDiv);
  hide(deckSizeDiv);
  hide(quizDiv);
  hide(endDiv);
}

function makeDeck(){
  let newDeck = [];

  for (const wordType in quizData) {              
    const categories = quizData[wordType];       

    for (const categoryName in categories) {   
      let category = categories[categoryName]
      
      if (selection.allCards || selection.selectedCategories.includes(categoryName)){
        for (const card in category){
          newDeck.push(category[card])
        }

      }
    }
  }

  return newDeck;
}

function endQuiz(){
  hide(quizDiv);
  show(endDiv);

  score = ((wins / deckSize) * 100).toFixed(2) ;
  scoreDiv.innerHTML = `Score: ${score}%`;
  
  let resultString = ``;

  for(const word in missedCards){
    resultString += `<li>${missedCards[word].english} - ${missedCards[word].spanish}</li>`;
  }

  badDiv.innerHTML = `<ul class="list-unstyled"> ${resultString}</ul>`;
}

function checkAnswer(){
  let input = inputForm.value.trim().toLowerCase();
  
  if (input === ""){
    return ;
  }
  if (input === currentCard.spanish){
    succeed();
  } else{
    failed();
  }
  
  nextRound();
}

function nextRound(){
  hide(answerSubmitBtn);
  hide(skipBtn);

  if (deck.length < 1){
    nextBtn.innerHTML = "See Results!"
  }
  show(nextBtn);
}

function failed(){
  missedCards.push(currentCard);
  resultDiv.classList.remove("text-success");
  resultDiv.classList.add("text-danger");
  resultDiv.innerHTML = `Wrong! The answer was <b>${currentCard.spanish}</b>`;
}

function succeed(){
  wins += 1;
  resultDiv.classList.remove("text-danger");
  resultDiv.classList.add("text-success");
  resultDiv.innerHTML = "Well done!";
}

function skipCard(){
  failed();
  nextRound();
}

function newQuizRound(){
  if (deck.length == 0){
    endQuiz();
    return ;
  }

  show(answerSubmitBtn);
  show(skipBtn);
  hide(nextBtn);
  resultDiv.innerHTML = "";

  pickCard();
  inputForm.value = "";
  deckDrogressionDiv.innerHTML = `Card: ${deckSize-deck.length}/${deckSize}`;
  correctPercentDiv.innerHTML = `${deckSize - 1 == deck.length? '-' : ((wins / (wins + 
    missedCards.length)) * 100).toFixed(2) }%`;

  EnglishWordDiv.innerHTML = currentCard.english;
  if (currentCard.hasImage){
    quizImage.src = currentCard.image;
  }
}

function pickCard(){
  let newCard = deck[0];
  deck.shift();
  currentCard = newCard;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}


function getHalf(deck) {
  const halfLength = Math.floor(deck.length / 2);
  return deck.slice(0, halfLength);
}

function startQuiz(){

  let newDeck = makeDeck()
  shuffleDeck(newDeck);

  if (selection.half) {
    newDeck = getHalf(newDeck);
  }
  deck = newDeck;
  deckSize = deck.length;

  hide(deckSizeDiv);
  show(quizDiv)
  nextBtn.innerHTML = "Next Card!"

  newQuizRound()
}

function onDsBtnClick(event){
  let btn = event.target;

  if (btn === fullBtn){
    fullBtn.classList.add("selected-btn");
    halfBtn.classList.remove("selected-btn");
    deckSizeCardsDiv.innerHTML= `Total cards ${selection.cards}`;
    selection.half = false;
  } else {
    halfBtn.classList.add("selected-btn");
    fullBtn.classList.remove("selected-btn");
    deckSizeCardsDiv.innerHTML= `Total cards ${selection.cards/2}`;
    selection.half = true;
  }

}

function chooseDeckSize(){
  hide(deckCreationDiv)
  show(deckSizeDiv)

  deckSizeCardsDiv.innerHTML = `Total cards: ${selection.cards}`;
}

function onDeckSubmit(){
  if (selection.cards == 0) {
    return ;
  }

  chooseDeckSize();
}

function selectAllCards(){
  
  selection.allCards = true;
  selection.cards = cardsNumber;
  chooseDeckSize();
}

function onCategoryBtn(event){
  let btn = event.target;

  if(btn.classList.contains("selected-btn")) {
    btn.classList.remove("selected-btn");
    updateSelection(btn, false);
  } else{
    btn.classList.add("selected-btn");
    updateSelection(btn, true);
  }
}

function resetButtons(){

  let buttons = deckCreationContentDiv.querySelectorAll('button.category-btn');

  buttons.forEach(button => {
    button.classList.remove("selected-btn");
  });

  fullBtn.classList.add("selected-btn");
  halfBtn.classList.remove("selected-btn"); 
}

function onAllTypeBtn(event, add){
  let clickedBtn = event.target;
  let parentDiv = clickedBtn.closest(".typeContainer");
  let buttons = parentDiv.querySelectorAll('button.category-btn');

  buttons.forEach(button => {
    if (add && !button.classList.contains("selected-btn")) {
      button.classList.add("selected-btn");
      updateSelection(button, true);
    } else if (!add && button.classList.contains("selected-btn")){
        button.classList.remove("selected-btn");
        updateSelection(button, false);
    }
  });
}

function updateSelection(btn, add){
  let category = btn.dataset.category;
  let cards = Number(btn.dataset.cards);

  if (add){
    selection.selectedCategories.push(category)
    selection.cards += cards
  } else {
    selection.selectedCategories = selection.selectedCategories.filter(item => item !== category);
    selection.cards -= cards
  }

  document.getElementById('card-number').innerHTML = `Deck Size: ${selection.cards}`;
}


function loadDeckSelection(data){
  let dataString = "";

  for (const wordType in data){
    let typeCardsNumber = 0;
    let typeString = "";
    const categories = data[wordType];

    let categoriesString = "";
    for (const categoryName in categories){
      let categoryCardNumber = categories[categoryName].length;
      let categoryString = `<div class=" col-lg-3 col-4 pt-1 g-4 "><div class=""><button class="category-btn btn-no-wrap  btn btn-primary  w-100 py-4" onclick="onCategoryBtn(event)" 
      data-type="${wordType}" data-category="${categoryName}" data-cards="${categoryCardNumber}" >${categoryName} </button> 
      </div> <div class=" pt-3">Cards: ${categoryCardNumber}</div></div>`;

      categoriesString += categoryString;
      typeCardsNumber += categoryCardNumber;
    }
    
    categoriesString += `<div class="row mx-0 justify-content-between mt-5"><div class="col-lg-5 col-6"><button class="btn  btn-primary w-100 py-3 add-btn" onclick="onAllTypeBtn(event, true)">All</button></div>`;
    categoriesString += `<div class="col-lg-5 col-6  "><button class="btn  btn-primary w-100 py-3 clear-btn" onclick="onAllTypeBtn(event, false)">Clear</button></div></div>`;

    typeString = `<div class="typeContainer row align-items-center mb-5"><div class="row d-flex align-items-center"><div class="col-6 text-start h3">${wordType} </div> <div class="col-6 text-end h5"> Cards: ${typeCardsNumber} </div> </div> ${categoriesString} </div>`;

    dataString += typeString;
    cardsNumber += typeCardsNumber;
  }

  document.getElementById('card-number').innerHTML = `Deck Size: 0`;
  deckCreationContentDiv.innerHTML = dataString;
}


function prepareData(data){
  quizData = data;
  hide(waitDiv);
  show(deckCreationDiv)
  loadDeckSelection(data)
}


fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    prepareData(data);
  })
  .catch(err => console.error('Failed to load quiz data:', err));

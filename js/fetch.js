const waitDiv = document.getElementById('wait');
const menuDiv = document.getElementById('menu');
const quizDiv = document.getElementById('quiz');

const deckCreationDiv = document.getElementById('deck-creation');
const deckCreationContentDiv = document.getElementById('deck-creation-content');

let quizData
let htmlStrings

let selection = {selectedCategories: [], cards: 0}
let deck
let deckSize
let missedCards
let wins
let currentCard


function check(answer, input){
    if (input === answer){
        return true;
    }

    return false;
}

function show(div){
    div.classList.remove('hidden');
}

function hide(div){
    div.classList.add('hidden');
}

function pickCard(deck){
    let deckSize = deck.length;
    let randomIndex = Math.floor(Math.random() * deckSize);
    let randomCard = deck[randomIndex];
    
}

function resset(){
  let selection = {selectedTypes : [], selectedCategories: [], cards: 0}
  let deck = []
  let deckSize = 0
  let missedCards = [] 
  let wins = 0
  let currentCard = nil
}


function allCardsMode(){
    newCards = getAllCards(quizData)
    console.log(newCards)
      pickCard(newCards)
}

function pickMode(mode){
   hide(menuDiv)
   show(quizDiv)
   allCardsMode()
}

function makeDeck(){
  let newDeck = [];

  if (selection.cards == 0) { return ; }

  for (const wordType in quizData) {              
    const categories = quizData[wordType];       

    for (const categoryName in categories) {   
      let category = categories[categoryName]
      
      if (selection.selectedCategories.includes(categoryName)){
        newDeck.push(...category)
      }
    }
  }

  return newDeck;
}

function onDeckSubmit(){
  
}

function selectAllCards(){

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

  document.getElementById('card-number').innerHTML = `Cards: ${selection.cards}`;
}


function loadDeckSelection(data){
  let dataString = "";
  let cardsNumber = 0

  for (const wordType in data){
    let typeCardsNumber = 0;
    let typeString = "";
    const categories = data[wordType];

    let categoriesString = "";
    for (const categoryName in categories){
      let categoryCardNumber = categories[categoryName].length;
      let categoryString = `<div><button class="category-btn" onclick="onCategoryBtn(event)" 
      data-type="${wordType}" data-category="${categoryName}" data-cards="${categoryCardNumber}" >${categoryName} </button> 
      Cards: ${categoryCardNumber}</div>`;

      categoriesString += categoryString;
      typeCardsNumber += categoryCardNumber;
    }
    
    categoriesString += `<div><button onclick="onAllTypeBtn(event, true)">All</button></div>`;
    categoriesString += `<div><button onclick="onAllTypeBtn(event, false)">Clear</button></div>`;

    typeString = `<div class="typeContainer"><div>${wordType} - Cards: ${typeCardsNumber} </div> ${categoriesString} </div>`;

    dataString += typeString;
    cardsNumber += typeCardsNumber;
  }

  document.getElementById('card-number').innerHTML = `Cards: 0`;
  deckCreationContentDiv.innerHTML = dataString;
}



function prepareData(data){
  quizData = data;
  loadDeckSelection(data)
  
}

function getAllCards(data) {
  const allCards = [];

  for (const wordType in data) {              
    const categories = data[wordType];       

    for (const category in categories) {      
      const cards = categories[category];    

      if (Array.isArray(cards)) {
        allCards.push(...cards);              
      }
    }
  }

  return allCards;
}



fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    prepareData(data);
  })
  .catch(err => console.error('Failed to load quiz data:', err));

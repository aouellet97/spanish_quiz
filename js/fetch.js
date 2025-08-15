const waitDiv = document.getElementById('wait');
const menuDiv = document.getElementById('menu');
const quizDiv = document.getElementById('quiz');

let quizData = null;


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

function loadPage(){
    hide(waitDiv)
    show(menuDiv)
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
    quizData = data;
    loadPage();
  })
  .catch(err => console.error('Failed to load quiz data:', err));

/**
 * Created by Dasha on 04.11.2017.
 */
(() => {

    let click1 = {};
    let   click2 = {};
    let   level = "medium";
    let   numStars = 3;
    let   pairs = 8;
    let   gameStarted, matches, moves, timer, twoStar, oneStar;


    class Card {
        constructor(card, num) {
            let cardID = card.id + '-' + num;
            this.id = card.id + '-' + num;
            this.image = card.image;
            this.name = card.name;
            this.html =
                `<article class="card" id="${cardID}">
                    <div class="cardBack">
                    <img src="images/${this.image}" class="card-image" >
                    </div>
                    <div class="cardFront" ></div>
                </article>`;
        }
    }


    const coloring=()=> {
       let selectTheme = document.getElementById("cardSkirt").value;
        if (selectTheme == 'White'){
            let cardsColorFront = document.querySelectorAll('.cardFront');
            cardsColorFront.forEach(item=>(item.style.backgroundColor= "#ffffff87;"));

            let cardsColorBack = document.querySelectorAll('.cardBack');
            cardsColorBack.forEach(item=>(item.style.backgroundColor= "#ffffff87;"));
        } else if (selectTheme == 'Red'){
            let cardsColorFront = document.querySelectorAll('.cardFront');
            cardsColorFront.forEach(item=>(item.style.backgroundColor= "rgba(206, 139, 139, 0.17)"));

            let cardsColorBack = document.querySelectorAll('.cardBack');
            cardsColorBack.forEach(item=>(item.style.backgroundColor= "rgba(206, 139, 139, 0.17)"));
        } else  if (selectTheme == 'Green'){
            let cardsColorFront = document.querySelectorAll('.cardFront');
            cardsColorFront.forEach(item=>(item.style.backgroundColor= "rgba(105, 165, 156, 0.15)"));

            let cardsColorBack = document.querySelectorAll('.cardBack');
            cardsColorBack.forEach(item=>(item.style.backgroundColor= "rgba(105, 165, 156, 0.15)"));
        }
    }


    const setLevel = (level) => {
        let modal = document.getElementById('startModal');
        modal.style.display='none';
        pairs = gameLevels[level].pairs;
        twoStar = gameLevels[level].twoStar;
        oneStar = gameLevels[level].oneStar;

        let choseLevel =document.getElementById('gameBoard');
        choseLevel.classList.remove('easy');
        choseLevel.classList.remove('medium');
        choseLevel.classList.remove('hard');
        choseLevel.classList.add(gameLevels[level].class);
    };


    const trimArray = (array) => {
        let newArray = array.slice();
        while (newArray.length > pairs) {
            let randomIndex = Math.floor(Math.random() * newArray.length);
            newArray.splice(randomIndex, 1);
        }
        return newArray;
    };


    const makeCardArray =(data, level)=> {
        let array = [];
        let trimmedData = trimArray(data, level);
        trimmedData.forEach(function(card) {
            array.push(new Card(card, 1));
            array.push(new Card(card, 2));
        });
        return array;
    };


    const shuffle = (array) => {
        let currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };


    const displayCards = (cardArray) => {
        cardArray.forEach(function(card) {
            document.getElementById('gameBoard').insertAdjacentHTML('afterbegin',card.html);
            let startCard= document.getElementById(card.id);

            startCard.onclick=function (){
                if (!gameStarted) {
                    gameTimer();
                    gameStarted = true;
                }
                checkMatch(card);
            };
        });
    };


    const checkMatch = (card) => {
        if (!click1.name) {
            click1 = card;
            let selectedCard=document.getElementById(card.id);
            selectedCard.classList.add('flipped');
            return;
        } else if (!click2.name && click1.id !== card.id) {
            click2 = card;
            let selectedCard=document.getElementById(card.id);
            selectedCard.classList.add('flipped');
            moves++;
            let steps=document.getElementById('moves');
            steps.textContent=moves;
            checkStars();
        } else return;
        if (click1.name === click2.name) {
           setTimeout(delete_card, 700);
        } else {
            hideCards();
        }
    };


    function delete_card(card){
        let selectedCard1=document.getElementById(click1.id);
        let selectedCard2=document.getElementById(click2.id);
        selectedCard1.getElementsByClassName('cardFront')[0].style.display='none';
        selectedCard1.getElementsByClassName('cardBack')[0].style.display='none';

        selectedCard2.getElementsByClassName('cardFront')[0].style.display='none';
        selectedCard2.getElementsByClassName('cardBack')[0].style.display='none';

        foundMatch();
    }


    const foundMatch = ()=> {
        matches++;
        if (matches === pairs) {
            gameOver();
        }
        let selectedCard1=document.getElementById(click1.id);
        let selectedCard2=document.getElementById(click2.id);

        selectedCard1.onclick='';
        selectedCard2.onclick='';

        click1 = {};
        click2 = {};
    };


    const hideCards = () => {
        setTimeout(function() {
            let selectedCard1=document.getElementById(click1.id);
            let selectedCard2=document.getElementById(click2.id);

            selectedCard1.classList.remove('flipped');
            selectedCard2.classList.remove('flipped');
            click1 = {};
            click2 = {};
        }, 600);
    };


    const gameOver = () => {
        clearInterval(timer);
        setTimeout(function() {
            let winModal=document.getElementById('winModal');
            winModal.style.display = 'block';
        }, 500);

    };


    const checkStars = () => {
        let currentStars;
        if (moves >= oneStar) {
            currentStars = 1;
        } else if (moves >= twoStar) {
            currentStars = 2;
        } else currentStars = 3;
        displayStars(currentStars);
    };


    const gameTimer = () => {
        let startTime = new Date().getTime();
        timer = setInterval(function() {
            var now = new Date().getTime();
            var elapsed = now - startTime;

            let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            let currentTime = minutes + ':' + seconds;
            let timer = document.querySelectorAll('.clock');
            timer.forEach(item=>(item.textContent=currentTime));
        }, 750);
    };


    const displayStars = (num) => {
        const starImage = '<img src="images/star.svg" width="40px" height="40px">';
        let result =  document.getElementById('finalResult');
        result.innerHTML = '';

        for (let i = 0; i < num; i++) {
        let raiting = document.createElement('span');
            raiting.innerHTML = starImage;
            result.appendChild(raiting);
        }
    };


    window.addEventListener('load', function() {
        document.getElementById('startModal').style.display = 'block';
    });


    document.getElementById('openModal').onclick = function() {
        document.getElementById('winModal').style.display = "block";
    }


    document.getElementById('easy-level').onclick=function() {
        startGame(cardData, "easy");
    };


    document.getElementById('medium-level').onclick=function() {
        startGame(cardData, 'medium');
    };


    document.getElementById('hard-level').onclick=function() {
        startGame(cardData, 'hard');
    };


    document.getElementById('restart').onclick=function() {
        document.getElementById('winModal').style.display='none';
        document.getElementById('startModal').style.display='block';

    };


    const startGame = (cards, level) => {
        gameStarted = false;
        moves = 0;
        matches = 0;
        setLevel(level);
        document.getElementById('gameBoard').innerHTML = '';

        let timer = document.querySelectorAll('.clock');
        timer.forEach(item=>item.textContent);
        let winModal=document.getElementById('winModal');
        winModal.style.display='none';

        let cardArray = makeCardArray(cardData, level);
        shuffle(cardArray);
        displayCards(cardArray);
        coloring();
    };
})();

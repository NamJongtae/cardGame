/*-------------------------------------카드 설정 관련 함수-------------------------------------*/
import { totalCard, timeInterval, totalTime, checked, setChecked  } from "./main.js"; 
import { playSound,soundArray, soundArray2, soundArray3, bgm,  } from "./audio.js";

const $timeRecord = document.querySelector(".time-record");
const $container = document.querySelector(".container");
const $recordModal = document.querySelector(".modal-wrapper.record");
const animal = ['🐒','🦍','🐈','🐇','🐎','🦌','🦏','🐄','🦔','🐖','🐑','🐪','🦘','🐘','🐁','🦥'];
const randomArray = [];
const randomArray2 = [];
const cardArray = [];
const completedCard = [];

 function cardSetting() {
    for (let i = 0; i < totalCard; i++) {
      const $card = document.createElement("div");
      const $cardInner = document.createElement("div");
      const $cardFront = document.createElement("div");
      const $cardBack = document.createElement("div");
  
      $card.setAttribute("class", "card");
      $card.addEventListener("click", clickCard);
      $cardInner.setAttribute("class", "card-inner");
      $cardFront.setAttribute("class", "card-front");
      $cardBack.setAttribute("class", "card-back");
      $container.append($card);
      $card.append($cardInner);
      $cardInner.append($cardFront);
      $cardInner.append($cardBack);
  
      if (i < totalCard/2) {
        $cardFront.innerHTML = animal[randomArray[i]];
        $card.setAttribute("name", randomArray[i]);
      } else {
        $cardFront.innerHTML = animal[randomArray2[i % (totalCard/2)]];
        $card.setAttribute("name", randomArray2[i % (totalCard/2)]);
      }
    }
  }
  
   function random(array) {
    for (let i = 0; i < totalCard/2; i++) {
      let randomNnum = Math.floor(Math.random() * totalCard/2 + 1);
      if (array.indexOf(randomNnum) == -1) {
        array.push(randomNnum);
      } else {
        i--;
      }
    }
  }
  
  // 카드 클릭 시 일어나는 함수 
   function clickCard() {
    if (checked === false) {
      playSound(soundArray);
      this.classList.toggle("flipped");
      cardArray.push(this);
      cardArray[0].style.pointerEvents = "none";
      if (cardArray.length !== 2) return; // 클릭한 카드의 수가 2가 아니면 함수 종료!
  
      if (cardArray.length === 2) setChecked() // 클릭한 카드의 수가 2이면 아래 실행
      if (
        cardArray[0].getAttribute("name") === cardArray[1].getAttribute("name")
      ) {
        // 카드 일치시
        setTimeout(() => playSound(soundArray3), 100);
        completedCard.push(cardArray[0]);
        completedCard.push(cardArray[1]);
        cardArray[0].style.pointerEvents = "none";
        cardArray[1].style.pointerEvents = "none";
        cardArray.splice(0);
        
        setChecked();
        if (completedCard.length === totalCard) {
          clearInterval(timeInterval);
          bgm.pause();
         
          setTimeout(()=> {
           $timeRecord.innerHTML = totalTime;
            $recordModal.classList.toggle("active");
          },500);
        }
        return;
      }
  
      // 카드가 일치하지 않을 시
      setTimeout(function () {
        playSound(soundArray2);
  
        // 카드를 다시 뒤집음
        cardArray[0].classList.toggle("flipped");
        cardArray[1].classList.toggle("flipped");
        cardArray[0].style.pointerEvents = "auto";
        cardArray.splice(0);
        setChecked();
      }, 1000);
    }
  }
  /*-------------------------------------// 카드 설정 관련 함수-------------------------------------*/

  export {randomArray, randomArray2, cardArray, completedCard, cardSetting, random}

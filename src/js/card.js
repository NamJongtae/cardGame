/*-------------------------------------카드 설정 관련 함수-------------------------------------*/
import { totalCard, timeInterval, totalTime, checked, setChecked  } from "./main.js"; 
import { playSound,soundArray, soundArray2, soundArray3, bgm} from "./audio.js";

const $timeRecord = document.querySelector(".time-record");
const $container = document.querySelector(".container");
const $recordModal = document.querySelector(".modal-wrapper.record");
const animal = ['🐒','🦍','🐈','🐇','🐎','🦌','🦏','🐄','🦔','🐖','🐑','🐪','🦘','🐘','🐁','🦥'];
const randomCardArray1 = [];
const randomCardArray2 = [];
const cardArray = [];
const completedCardArray = [];

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
        $cardFront.innerHTML = animal[randomCardArray1[i]];
        $card.setAttribute("name", randomCardArray1[i]);
      } else {
        $cardFront.innerHTML = animal[randomCardArray2[i % (totalCard/2)]];
        $card.setAttribute("name", randomCardArray2[i % (totalCard/2)]);
      }
    }
  }
  // 랜덤으로 0~8 난수를 뽑아 배열을 만들어 주는 함수 이것을 통해 카드의 이미지와 name이 달라짐
  function shuffle(array) {
    while (array.length < totalCard/2) {
      let randomNum = Math.floor(Math.random() * totalCard/2);
      if (array.indexOf(randomNum) === -1) {
        array.push(randomNum);
      }
    }
  }
  
  // 카드 클릭 시 
   function clickCard() {
    if (checked === false) {
      playSound(soundArray);
      this.classList.toggle("flipped");
      cardArray.push(this);
      cardArray[0].style.pointerEvents = "none";

      // 클릭한 카드의 수가 2가 아니면 함수 종료!
      if (cardArray.length !== 2) return; 

      // 클릭한 카드의 수가 2개 이면 checked 값을 true 변경
      if (cardArray.length === 2) setChecked() 

      // 카드 일치시
      if (cardArray[0].getAttribute("name") === cardArray[1].getAttribute("name")) {
        compareCards()
        return;
      }
  
      // 카드가 일치하지 않을 시
      setTimeout(function () {
        playSound(soundArray2);
  
        // 카드를 다시 뒤집음
        cardArray.forEach(card => card.classList.toggle("flipped"));
        cardArray[0].style.pointerEvents = "auto";
        cardArray.splice(0);

        // 클릭한 카드의 수가 2개 이면 checked 값을 true 변경
        setChecked();
      }, 1000);
    }
  }
/* 카드 비교함수 */
  function compareCards (){
    setTimeout(() => playSound(soundArray3), 100);
    completedCardArray.push(cardArray[0]);
    completedCardArray.push(cardArray[1]);
    cardArray.forEach(el=>el.style.pointerEvents = 'none');
    cardArray.splice(0);
    // 클릭한 카드의 수가 2개 이면 checked 값을 false 변경
    
    setChecked();
    // 완료카드수가 총 카드 수와 같을 때 게임 종료
    if (completedCardArray.length === totalCard) {
      clearInterval(timeInterval);
      bgm.pause();
     
      setTimeout(()=> {
       $timeRecord.innerHTML = totalTime;
        $recordModal.classList.toggle("active");
      },500);
    }
  }
  /*-------------------------------------// 카드 설정 관련 함수-------------------------------------*/

  export {randomCardArray1, randomCardArray2, cardArray, completedCardArray, cardSetting, shuffle}


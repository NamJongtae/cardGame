const $container = document.querySelector(".container");
const $cardFront = document.querySelectorAll(".cardFront");
const $cardBack = document.querySelectorAll(".card_back");
const $timer = document.querySelector(".timer-box span");
const $startBtn = document.querySelector(".start-btn");
const $modal = document.querySelector(".modal-wrapper.gamestart");
const $stopBtn = document.querySelector(".stop-btn");
const $resetBtn = document.querySelector(".reset-btn");
const $audioBtn = document.querySelector(".audioBtn");
const $recordModal = document.querySelector(".modal-wrapper.record");
const $timeRecord = document.querySelector(".time-record");
const $recordBtn = document.querySelector(".record-btn");
const $recordCancelBtn = document.querySelector(".cancel-btn");
/* 카드 행 열 지정 곱 => 짝수만 가능 홀수 시 짝이 안맞음 너무 큰 수를 지정하면 화면에서 벗어남 */ 
const level = {"lv1":{row:"4",col:"3",}, "lv2":{row:"5",col:"4"},"lv3":{row:'6',col:"5"}};
const row = level.lv1.row;
const col = level.lv1.col;
const totalCard = row * col;
const animal = ['🐒','🦍','🐈','🐇','🐎','🦌','🦏','🐄','🦔','🐖','🐑','🐪','🦘','🐘','🐁','🦥'];
const cardArray = [];
const completedCard = [];
const randomArray = [];
const randomArray2 = [];
const soundArray = [];
const soundArray2 = [];
const soundArray3 = [];

const bgm = new Audio();
bgm.src = "../audio/game_bgm.mp3";
bgm.volume = 0.3;
bgm.loop = true;
bgm.muted = true;
let isStop = false;
let checked = false;
let startTime = 0;
let totalTime = 0;
let isMute = false;
let timeInterval;

/* 버튼 클릭 이벤트 함수 추가 */
$startBtn.addEventListener("click", () => {
  $modal.classList.toggle("active");
  startGame();
});
$audioBtn.addEventListener("click", () => {
  $audioBtn.classList.toggle("mute");
  bgm.muted = $audioBtn.classList.contains("mute") ? true : false;
});
$resetBtn.addEventListener("click", resetGame);
$recordCancelBtn.addEventListener("click",()=>{
  $recordModal.classList.toggle("active");
});

function startGame() {
  $container.style.gridTemplateColumns = `repeat(${row}, 150px)`;
  $container.style.gridTemplateRows = `repeat(${col}, 120px)`;
  random(randomArray);
  random(randomArray2);
  soundSetting(soundArray, "../audio/card_effect.mp3");
  soundSetting(soundArray2, "../audio/card_effect2.mp3");
  soundSetting(soundArray3, "../audio/card_effect3.wav");
  $container.style.pointerEvents = "none";
  cardSetting();
  bgm.play();
  setTimeout(() => {
    let card = document.querySelectorAll(".card");
    for (let i = 0; i < card.length; i++) {
      card[i].classList.toggle("flipped"); // 카드 뒤집기
    }
    $container.style.pointerEvents = "auto"; // 게임시작 클릭 제한 해제
    startTime = new Date().getTime();
    timeInterval = setInterval(() => {
      totalTime = Math.floor(
        (new Date().getTime() - startTime) / 1000
      );
      $timer.innerHTML = totalTime;
    }, 1000);
  }, 800);
}

/*-------------------------------------카드 설정 관련 함수-------------------------------------*/
function cardSetting() {
  for (let i = 0; i < totalCard; i++) {
    const $card = document.createElement("div");
    const $cardInner = document.createElement("div");
    const $cardFront = document.createElement("div");
    const $cardBack = document.createElement("div");

    $card.setAttribute("class", "card");
    $card.addEventListener("click", click_card);
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
function click_card() {
  if (checked === false) {
    playSound(soundArray);
    this.classList.toggle("flipped");
    cardArray.push(this);
    cardArray[0].style.pointerEvents = "none";
    if (cardArray.length !== 2) return; // 클릭한 카드의 수가 2가 아니면 함수 종료!

    if (cardArray.length === 2) checked = true; // 클릭한 카드의 수가 2이면 아래 실행
    if (
      cardArray[0].getAttribute("name") === cardArray[1].getAttribute("name")
    ) {
      // 카드 일치시
      setTimeout(() => playSound(soundArray3), 300);
      completedCard.push(cardArray[0]);
      completedCard.push(cardArray[1]);
      cardArray[0].style.pointerEvents = "none";
      cardArray[1].style.pointerEvents = "none";
      cardArray.splice(0);
      
      checked = false;
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
      checked = false;
    }, 1000);
  }
}
/*-------------------------------------// 카드 설정 관련 함수-------------------------------------*/

/*----------------------------------Audio 관련 함수------------------------------------ */

// 10개의 Audio객체를 배열에 담아둔다.
function soundSetting(soundArray, soundSrc) {
  for (let i = 0; i < 10; i++) {
    const sound = new Audio();
    sound.src = soundSrc;

    // 크롬 예외 처리: audio 재생이 끝나면, 다시 로드해준다
    sound.addEventListener("ended", function () {
      if (window.chrome) {
        this.load();
      }
      this.pause();
    });

    soundArray.push(sound);
  }
}

function playSound(sound) {
  for (let i = 0; i < sound.length; i++) {
    if (sound[i].paused) {
      sound[i].muted = $audioBtn.classList.contains("mute") ? true : false;
      // 재생중이 아닌 Audio객체를 찾아서
      sound[i].play(); // 1회만 재생하고
      break; // 반복문을 나간다.
    }
  }
}
/*----------------------------------// Audio 관련 함수------------------------------------ */

// 게임 리셋 함수
function resetGame() {
  $resetBtn.style.pointerEvents = 'none';
  bgm.pause();
  bgm.load();
  cardArray.splice(0);
  completedCard.splice(0);
  randomArray.splice(0);
  randomArray2.splice(0);
  checked = false;
  clearInterval(timeInterval);
  $timer.innerHTML = 0;
  while($container.hasChildNodes()){
    $container.firstChild.remove();
  }
  startGame();
  setTimeout(()=>{  $resetBtn.style.pointerEvents = 'auto';}, 1200)

}

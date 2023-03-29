const container = document.querySelector(".container");
const cardFront = document.querySelectorAll(".cardFront");
const cardBack = document.querySelectorAll(".card_back");
const timer = document.querySelector(".timer-box span");
const startBtn = document.querySelector(".start-btn");
const modal = document.querySelector(".modal");
const stopBtn = document.querySelector(".stop-btn");
const resetBtn = document.querySelector(".reset-btn");
const audioBtn = document.querySelector(".audioBtn")
const totalCard = 16;
let cardArray = [];
let completedCard = [];
let randomArray = [];
let randomArray2 = [];
const soundArray = [];
const soundArray2 = [];
const soundArray3 = [];
const bgm = new Audio();
bgm.src = "../audio/game_bgm.mp3";
bgm.volume = 0.3;
bgm.loop = true;

let isStop = false;
let checked = false;
let startTime = 0;
let totalTime = 0;
let isMute = false;
let timeInterval = setInterval(() => {
  inner.innerHTML = Math.floor(
    (new Date().getTime() - startTime.getTime()) / 1000
  );
}, 1000);
clearInterval(timeInterval);

startBtn.addEventListener("click", () => {
  startGame();
});
audioBtn.addEventListener("click", () => {
  isMute = !isMute;
  bgm.muted = isMute;
  audioBtn.style.backgroundImage = isMute ? 'url("../img/muteBtn.png")' : 'url("../img/audioBtn.png")';
})
resetBtn.addEventListener("click", resetGame);
function startGame() {
  modal.style.display = "none";
  random(randomArray);
  random(randomArray2);
  soundSetting(soundArray, "../audio/card_effect.mp3");
  soundSetting(soundArray2, "../audio/card_effect2.mp3");
  soundSetting(soundArray3, "../audio/card_effect3.wav");
  container.style.pointerEvents = "none";
  cardSetting();
  bgm.play();
  setTimeout(() => {
    let card = document.querySelectorAll(".card");
    for (var i = 0; i < card.length; i++) {
      card[i].classList.toggle("flipped"); // 카드 뒤집기
    }
    container.style.pointerEvents = "auto"; // 게임시작 클릭 제한 해제
    startTime = new Date().getTime();
    timeInterval = setInterval(() => {
      totalTime = Math.floor(
        (new Date().getTime() - startTime) / 1000
      );
      timer.innerHTML = totalTime;
    }, 1000);
  }, 800);
}

/*-------------------------------------카드 설정 관련 함수-------------------------------------*/
function cardSetting() {
  for (i = 0; i < totalCard; i++) {
    const card = document.createElement("div");
    const cardInner = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");

    card.setAttribute("class", "card");
    card.addEventListener("click", click_card);
    cardInner.setAttribute("class", "card-inner");
    cardFront.setAttribute("class", "card-front");
    cardBack.setAttribute("class", "card-back");
    container.append(card);
    card.append(cardInner);
    cardInner.append(cardFront);
    cardInner.append(cardBack);

    if (i < 8) {
      cardFront.style.backgroundImage =
        "url(./img/card" + randomArray[i] + ".png)";
      card.setAttribute("name", randomArray[i]);
    } else {
      cardFront.style.backgroundImage =
        "url(./img/card" + randomArray2[i % 8] + ".png)";
      card.setAttribute("name", randomArray2[i % 8]);
    }
  }
}

function random(array) {
  for (let i = 0; i < 8; i++) {
    let randomNnum = Math.floor(Math.random() * 8 + 1);
    if (array.indexOf(randomNnum) == -1) {
      array.push(randomNnum);
    } else {
      i--;
    }
  }
}

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
      console.log("카드맞춤!");
      completedCard.push(cardArray[0]);
      completedCard.push(cardArray[1]);
      cardArray[0].style.pointerEvents = "none";
      cardArray[1].style.pointerEvents = "none";
      cardArray = [];

      checked = false;
      if (completedCard.length === 16) {
        clearInterval(timeInterval);
        setTimeout(
          `alert('축하합니다. 게임 클리어~ 총 걸린 시간은 ${totalTime}초')`,
          500
        );
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
      cardArray = [];
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
      sound[i].muted = isMute;
      // 재생중이 아닌 Audio객체를 찾아서
      sound[i].play(); // 1회만 재생하고
      break; // 반복문을 나간다.
    }
  }
}
/*----------------------------------// Audio 관련 함수------------------------------------ */

function resetGame() {
  bgm.pause();
  bgm.load();
  cardArray = [];
  completedCard = [];
  randomArray = [];
  randomArray2 = [];
  checked = false;
  clearInterval(timeInterval);
  timer.innerHTML = 0;
  while(container.hasChildNodes()){
    container.firstChild.remove();
  }
  startGame();
}

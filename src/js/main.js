import { shuffle,  randomCardArray1, randomCardArray2, cardArray, completedCardArray, cardSetting} from "./card.js";
import { playSound,soundArray, soundArray2, soundArray3, bgm, soundSetting} from "./audio.js";
import { startTime, setStartTime, totalTime, setTotalTime, setTotalPauseTime } from "./game.js";
import { setRaking } from "./modal.js";

const $body = document.querySelector("body");
const $container = document.querySelector(".container");
const $timer = document.querySelector(".timer-box span");
const $startBtn = document.querySelector(".start-btn");
const $modal = document.querySelector(".modal-wrapper.gamestart");
const $resetBtn = document.querySelector(".reset-btn");
const $levelPrevBtn = document.querySelector(".level-box .prev-btn");
const $levelNextBtn = document.querySelector(".level-box .next-btn");
const $levelNum = document.querySelector(".level-box .level");
const $rankingBtn = document.querySelector(".ranking-btn");
const $modalRank = document.querySelector(".modal-rank");
const $rankCloseBtn = document.querySelector(".modal-rank .close-btn");
const $pauseBtn = document.querySelector(".pause-btn");
const $gameGudieBtn = document.querySelector(".gameGudie-btn");
const $modalGameGuide = document.querySelector(".modal-guide");
const $guideCloseBtn = document.querySelector(".modal-guide .close-btn");
const $titleCards  = document.querySelectorAll(".title-card");
const $titlCardIneers = document.querySelectorAll(".titleCard-inner");

/* 카드 행 열 지정 곱 => 짝수만 가능 홀수 시 짝이 안맞음 너무 큰 수를 지정하면 화면에서 벗어남 */ 
const levelData = [{row:"4",col:"3",}, {row:"5",col:"4"},{row:'6',col:"5"}];
let level = 0;
let row = levelData[level].row;
let col = levelData[level].col;
let totalCard = row * col;
let timeInterval;
let checked = false;

$body.onselectstart = ()=>{return false;} 
$body.ondragstart = ()=>{return false;} 

/* 메인 시작화면 관련 이벤트 함수 */

// 시작화면 제목 카드 클릭 이벤트 함수
$titleCards.forEach(el=>el.addEventListener('click',clickTitleCard));
function clickTitleCard() {
  this.classList.toggle("flipped");
  if(!$titleCards[0].classList.contains("flipped")&&!$titleCards[1].classList.contains("flipped")) {
    setTimeout(() => {
      $titlCardIneers[0].style.animation = 'rotaingCard 1.5s infinite';
      $titlCardIneers[1].style.animation = 'rotaingCard 1.5s infinite';
    }, 500);

  }
  else{
      $titlCardIneers[0].style.animation = '';
      $titlCardIneers[1].style.animation = '';
  }
}

// 게임시작 버튼 클릭 이벤트 
$startBtn.addEventListener("click", startGame);


// 다음(->) 레벨 버튼 클릭 이벤트
$levelNextBtn.addEventListener('click',()=>{
  if(level===2) return;
  level++;
  row = levelData[level].row;
  col = levelData[level].col;
  totalCard = row * col;
  $levelNum.innerHTML = level===1 ? '보통' : '어려움';
  $levelNum.style.color = level ===1 ? "gold" : "red";
  $levelNextBtn.style.opacity =  `${level===1 ? 1 : 0.5 }`;
  $levelPrevBtn.style.opacity =  1;
})

// 이전(<-) 레벨 버튼 클릭 이벤트
$levelPrevBtn.addEventListener('click',()=>{
  if(level===0) return;
  level--;
  row = levelData[level].row;
  col = levelData[level].col;
  totalCard = row * col;
  $levelNum.innerHTML = level===0 ? '쉬움' : '보통';
  $levelNum.style.color = level ===0 ? "yellowgreen" : "gold";
  $levelNextBtn.style.opacity =  1;
  $levelPrevBtn.style.opacity =  `${level===1 ? 1 : 0.5 }`;
})

// 게임방법 버튼 클릭 이벤트
$gameGudieBtn.addEventListener('click',()=>{
  $modalGameGuide.classList.toggle("active");
})
// 게임방법 닫기 버튼 이벤트
$guideCloseBtn.addEventListener('click',()=>{
  $modalGameGuide.classList.toggle("active");
})

// 랭킹보기 버튼 클릭 이벤트
$rankingBtn.addEventListener('click',()=>{
  setRaking(1);
  $modalRank.classList.toggle("active");
})
// 랭킹보기 닫기 버튼 이벤트
$rankCloseBtn.addEventListener('click',()=>{
  $modalRank.classList.toggle("active");
})

/* // 메인 시작화면 관련 */

// 게임시작 함수
function startGame() {
  $body.style.overflow = 'auto';
  $modal.classList.toggle("active");
  $container.style.gridTemplateColumns = `repeat(${row}, 150px)`;
  $container.style.gridTemplateRows = `repeat(${col}, 120px)`;
  shuffle(randomCardArray1);
  shuffle(randomCardArray2);
  soundSetting(soundArray, "./audio/card_effect.mp3");
  soundSetting(soundArray2, "./audio/card_effect2.mp3");
  soundSetting(soundArray3, "./audio/card_effect3.wav");
  playSound(soundArray);
  $container.style.pointerEvents = "none";
  $pauseBtn.style.pointerEvents = 'none';
  $resetBtn.style.pointerEvents = 'none';
  cardSetting();
  bgm.play();

  // 게임시작 후 카드를 보여주고 뒤집기 위해 0.8s 지연시킴
  setTimeout(() => {
    const $card = document.querySelectorAll(".card");
    playSound(soundArray2);

     // 카드 뒤집기
    for (let i = 0; i < $card.length; i++) {
      $card[i].classList.toggle("flipped");
    }
    $container.style.pointerEvents = "auto"; 

    // 시작 시간 측정 
    setStartTime (new Date().getTime());

    // 0.01초 마다 시간 체크 task queue 오차
    timeInterval = setInterval(() => {
      setTotalTime(((new Date().getTime() - startTime) / 1000).toFixed(2));
      $timer.innerHTML = Math.floor(totalTime);
    }, 10);
  }, 800);

  setTimeout(()=>{
    $pauseBtn.style.pointerEvents = 'auto';
    $resetBtn.style.pointerEvents = 'auto';
},1000)
}

// 게임 리셋 함수
function resetGame() {
  bgm.pause();
  bgm.load();
  cardArray.splice(0);
  completedCardArray.splice(0);
  randomCardArray1.splice(0);
  randomCardArray2.splice(0);
  setTotalTime(0);
  setTotalPauseTime (0);
  checked = false;
  clearInterval(timeInterval);
  $timer.innerHTML = 0;
  while($container.hasChildNodes()){
    $container.firstChild.remove();
  }
  startGame();
  $modal.classList.remove("active");
}

// timeinterval setting
function setTimeInterval(interval) {
  timeInterval = interval
}

// checked setting
function setChecked(){
  checked = !checked
}

export { totalCard, timeInterval, totalTime, checked, level, setChecked, resetGame, startGame, setTimeInterval}
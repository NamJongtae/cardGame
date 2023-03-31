import { writeData, getRankingData } from "./firebase.js";
const body = document.querySelector("body");
const $container = document.querySelector(".container");
const $timer = document.querySelector(".timer-box span");
const $startBtn = document.querySelector(".start-btn");
const $modal = document.querySelector(".modal-wrapper.gamestart");
const $resetBtn = document.querySelector(".reset-btn");
const $audioBtn = document.querySelector(".audioBtn");
const $recordModal = document.querySelector(".modal-wrapper.record");
const $timeRecord = document.querySelector(".time-record");
const $recordBtn = document.querySelector(".record-btn");
const $inputMsg = document.querySelector(".input-msg");
const $inputName = document.querySelector(".input-name");
const $recordCancelBtn = document.querySelector(".cancel-btn");
const $errMsg = document.querySelector(".err-msg");
const $errName = document.querySelector(".err-name");
const $rakingTbale = document.querySelector(".ranking-tbody");
const $levelPrevBtn = document.querySelector(".level-box .prev-btn");
const $levelNextBtn = document.querySelector(".level-box .next-btn");
const $levelNum = document.querySelector(".level-box .level");
const $rankingLv1Btn = document.querySelector(".lv1-btn");
const $rankingLv2Btn = document.querySelector(".lv2-btn");
const $rankingLv3Btn = document.querySelector(".lv3-btn");
const $rankingBtn = document.querySelector(".ranking-btn");
const $modalRank = document.querySelector(".modal-rank");
const $closeBtn = document.querySelector(".close-btn");
const $pauseBtn = document.querySelector(".pause-btn");
const $loadBtn = document.querySelector(".load-btn");
const $rankTitleLevel = document.querySelector(".rankTitle-level");
const $gameGudieBtn = document.querySelector(".gameGudie-btn");

/* 카드 행 열 지정 곱 => 짝수만 가능 홀수 시 짝이 안맞음 너무 큰 수를 지정하면 화면에서 벗어남 */ 
const levelData = [{row:"4",col:"3",}, {row:"5",col:"4"},{row:'6',col:"5"}];
let level = 0;
let row = levelData[level].row;
let col = levelData[level].col;
let totalCard = row * col;
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
bgm.muted = false;
let checked = false;
let startTime = 0;
let totalTime = 0;
let timeInterval;
let startPauseTime = 0;
let endPauseTime = 0;
let totalPauseTime = 0;
setRaking(1);

$gameGudieBtn.addEventListener('click',()=>{
  
})
$loadBtn.addEventListener('click',()=>{
  clearInterval(timeInterval);
  body.style.overflow = 'auto';
  $modal.classList.remove('active');
  bgm.play();
  if(completedCard.length===totalCard) return;
  endPauseTime = new Date().getTime();
  totalPauseTime += (endPauseTime - startPauseTime) 
  timeInterval = setInterval(() => {
    totalTime = (
      ((new Date().getTime() - startTime) 
    - totalPauseTime) / 1000).toFixed(2);
    if(totalTime<0) totalTime = 0;
    $timer.innerHTML = Math.floor(totalTime);
  }, 10);
})
$pauseBtn.addEventListener('click',()=>{
  clearInterval(timeInterval);
  bgm.pause();
  body.style.overflow = 'hidden';
  $modal.classList.add('active');
  startPauseTime = new Date().getTime();
  $loadBtn.style.display = 'inline-block';
  $startBtn.innerHTML = "다시하기";
  $startBtn.removeEventListener('click', startGame);
  $startBtn.addEventListener('click', resetGame);
})
$closeBtn.addEventListener('click',()=>{
  $modalRank.classList.toggle("active");
})
$rankingBtn.addEventListener('click',()=>{
  $modalRank.classList.toggle("active");
})
$rankingLv1Btn.addEventListener('click',()=>{
  setRaking(1);
  $rankTitleLevel.innerHTML ='😀 쉬움';
})
$rankingLv2Btn.addEventListener('click',()=>{
  setRaking(2);
  $rankTitleLevel.innerHTML ='⚠️ 보통';
})
$rankingLv3Btn.addEventListener('click',()=>{
  setRaking(3);
  $rankTitleLevel.innerHTML ='☢️ 어려움';
})
async function setRaking(lvBtnNum) {
  const rankingData = await getRankingData(lvBtnNum);
  let medal ='';
  while($rakingTbale.childElementCount!==1) {
    $rakingTbale.lastElementChild.remove();
  }
  for(let i=0; i<rankingData.length; i++){
   const rankingTr = document.createElement("tr");
   const rank = document.createElement("td");
   const name = document.createElement("td");
   const record = document.createElement("td");
   const message = document.createElement("td");
   const createdAt = document.createElement("td");

   if(i===0) medal = '🥇';
   else if(i===1) medal = '🥈';
   else if(i===2) medal = '🥉';
   else medal ='';

   rank.innerHTML = medal + (i+1) +'등';
   name.innerHTML = rankingData[i].name;
   record.innerHTML = rankingData[i].record + '초';
   message.innerHTML = rankingData[i].message;
   createdAt.innerHTML = getCreatedAt(rankingData[i].createdAt.seconds);

   $rakingTbale.append(rankingTr);
   rankingTr.append(rank);
   rankingTr.append(record);
   rankingTr.append(name);
   rankingTr.append(message);
   rankingTr.append(createdAt);
  }
 
}


$levelNextBtn.addEventListener('click',()=>{
  if(level===2) return;
  level++;
  row = levelData[level].row;
  col = levelData[level].col;
  totalCard = row * col;
  console.log(row,col);
  console.log(level);
  $levelNum.innerHTML = (level===0 ? '쉬움' : (level===1 ? '보통' : '어려움'));
})
$levelPrevBtn.addEventListener('click',()=>{
  if(level===0) return;
  level--;
  console.log(level);
  row = levelData[level].row;
  col = levelData[level].col;
  totalCard = row * col;
  $levelNum.innerHTML = (level===0 ? '쉬움' : (level===1 ? '보통' : '어려움'));
})

export const getCreatedAt = (unixTime) => {
  const date = new Date(parseInt(unixTime)*1000);
  const year = date.getFullYear();
  const month = `0${(date.getMonth()+1)}`;
  const day = `0${date.getDate()}`;
  const hour = `0${date.getHours()}`
  const minute = `0${date.getMinutes()}`;
  // const second = `0${date.getSeconds()}`;
  return `${year}-${month.slice(-2)}-${day.slice(-2)}-${hour.slice(-2)}:${minute.slice(-2)}`;
}
/* 이벤트 함수 추가 */
$startBtn.addEventListener("click", startGame);
$audioBtn.addEventListener("click", () => {
  $audioBtn.classList.toggle("mute");
  bgm.muted = $audioBtn.classList.contains("mute") ? true : false;
});
$resetBtn.addEventListener("click", resetGame);
$recordCancelBtn.addEventListener("click",()=>{
  $recordModal.classList.toggle("active");
});
$recordBtn.addEventListener('click',()=>{
  if($inputName.value.length===0){
    $errName.classList.add("active");
    return;
  }
  if($inputMsg.value.length===0||$inputMsg.value.replace(/ /g,"").length===0){
    $errMsg.classList.add("active");
    return;
  }
  if(totalTime<1) {alert('비정상적인 기록입니다.'); return;}
  // 파이어베이스 데이터 전송
  const data = {name:$inputName.value, record: totalTime, message: $inputMsg.value, createdAt: new Date(), level}
  writeData(data);
  $inputName.value = "";
  $inputMsg.value = "";
  $recordModal.classList.remove("active");
})
$inputMsg.addEventListener('input',(e)=>{
  $inputMsg.value = e.target.value;
  if($inputMsg.value.replace(/ /g,"").length===0){
    $errMsg.classList.add("active")
    return;
  }
  $errMsg.classList.remove("active");
})
$inputName.addEventListener('input',(e)=>{
  $inputName.value = e.target.value.replace(/ /g, "");
  if($inputName.value.length===0){
    $errName.classList.add("active")
    return;
  }
  $errName.classList.remove("active");
})

function startGame() {
  body.style.overflow = 'auto';
  $modal.classList.toggle("active");
  $container.style.gridTemplateColumns = `repeat(${row}, 150px)`;
  $container.style.gridTemplateRows = `repeat(${col}, 120px)`;
  random(randomArray);
  random(randomArray2);
  soundSetting(soundArray, "../audio/card_effect.mp3");
  soundSetting(soundArray2, "../audio/card_effect2.mp3");
  soundSetting(soundArray3, "../audio/card_effect3.wav");
  playSound(soundArray);;
  $container.style.pointerEvents = "none";
  cardSetting();
  bgm.play();

  setTimeout(() => {
    let card = document.querySelectorAll(".card");
    playSound(soundArray2);
    for (let i = 0; i < card.length; i++) {
      card[i].classList.toggle("flipped"); // 카드 뒤집기
    }
    $container.style.pointerEvents = "auto"; // 게임시작 클릭 제한 해제
    startTime = new Date().getTime();
    timeInterval = setInterval(() => {
      totalTime = (
        (new Date().getTime() - startTime) / 1000
      ).toFixed(2);
      $timer.innerHTML = Math.floor(totalTime);
    }, 10);
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
  totalTime = 0;
  totalPauseTime = 0;
  checked = false;
  clearInterval(timeInterval);
  $timer.innerHTML = 0;
  while($container.hasChildNodes()){
    $container.firstChild.remove();
  }
  startGame();
  $modal.classList.remove("active");
  setTimeout(()=>{  $resetBtn.style.pointerEvents = 'auto';}, 1200)

}

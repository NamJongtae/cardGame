/* 게임 진행중 화면 버튼 관련 이벤트 함수 */
import { bgm } from "./audio.js";
import { completedCardArray } from "./card.js";
import { startGame, resetGame, timeInterval, totalCard, setTimeInterval } from "./main.js";

const $startBtn = document.querySelector(".start-btn");
const $audioBtn = document.querySelector(".audioBtn");
const $body = document.querySelector("body");
const $modal = document.querySelector(".modal-wrapper.gamestart");
const $timer = document.querySelector(".timer-box span");
const $loadBtn = document.querySelector(".load-btn");
const $pauseBtn = document.querySelector(".pause-btn");
const $resetBtn = document.querySelector(".reset-btn");

let startTime = 0;
let startPauseTime = 0;
let endPauseTime = 0;
let totalPauseTime = 0;
let totalTime = 0;

$loadBtn.addEventListener('click',()=>{
    clearInterval(timeInterval);
    $body.style.overflow = 'auto';
    $modal.classList.remove('active');
    if(completedCardArray.length===totalCard) return;
    bgm.play();
    endPauseTime = new Date().getTime();
    totalPauseTime += (endPauseTime - startPauseTime) 
    setTimeInterval (setInterval(() => {
      totalTime = (
        ((new Date().getTime() - startTime) 
      - totalPauseTime) / 1000).toFixed(2);
      if(totalTime<0) totalTime = 0;
      $timer.innerHTML = Math.floor(totalTime);
    }, 10));
  })
  
  $pauseBtn.addEventListener('click',()=>{
    clearInterval(timeInterval);
    bgm.pause();
    $body.style.overflow = 'hidden';
    $modal.classList.add('active');
    startPauseTime = new Date().getTime();
    $loadBtn.style.display = 'inline-block';
    $startBtn.innerHTML = "다시하기";
    $startBtn.removeEventListener('click', startGame);
    $startBtn.addEventListener('click', resetGame);
  })
  $audioBtn.addEventListener("click", () => {
    $audioBtn.classList.toggle("mute");
    bgm.muted = $audioBtn.classList.contains("mute") ? true : false;
  });
  $resetBtn.addEventListener("click", resetGame);
  /* // 게임 진행중 화면 버튼 관련 이벤트 함수 */

  /* 시간 setting 함수 */
  function setStartTime(time) {
    startTime = time;
  }
  function setTotalTime(time) {
    totalTime = time
  }
  function setTotalPauseTime(time){
    totalPauseTime = time
  }
/* // 시간 관련 set함수 */

  export  {startTime, setStartTime, totalTime, setTotalTime, setTotalPauseTime }
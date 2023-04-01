/*----------------------------------Audio 관련 함수------------------------------------ */

// 10개의 Audio객체를 배열에 담아둔다.
const $audioBtn = document.querySelector(".audioBtn");
const bgm = new Audio();
bgm.src = "../audio/game_bgm.mp3";
bgm.volume = 0.3;
bgm.loop = true;
bgm.muted = false;
const soundArray = [];
const soundArray2 = [];
const soundArray3 = [];
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
  
  export { bgm, soundArray, soundArray2, soundArray3, playSound, soundSetting}
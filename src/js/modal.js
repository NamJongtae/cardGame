import { writeData, getRankingData } from "./firebase.js";
import { totalTime } from "./game.js";
import { getCreatedAt } from "./library.js";
import { level } from "./main.js";

const $recordModal = document.querySelector(".modal-wrapper.record");
const $recordBtn = document.querySelector(".record-btn");
const $inputMsg = document.querySelector(".input-msg");
const $inputName = document.querySelector(".input-name");
const $recordCancelBtn = document.querySelector(".cancel-btn");
const $errMsg = document.querySelector(".err-msg");
const $errName = document.querySelector(".err-name");
const $rankingLv1Btn = document.querySelector(".lv1-btn");
const $rankingLv2Btn = document.querySelector(".lv2-btn");
const $rankingLv3Btn = document.querySelector(".lv3-btn");
const $rankTitleLevel = document.querySelector(".rankTitle-level");
const $rakingTbale = document.querySelector(".ranking-tbody");
const $modalRank = document.querySelector(".modal-rank");

/* 기록 모달창 관련 이벤트 함수 */
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
    if(totalTime < 1) {
      alert('비정상적인 기록입니다.');
     return;
    }

    // 파이어베이스 데이터 전송
    const data = {name:$inputName.value, record: parseFloat(totalTime), message: $inputMsg.value, createdAt: new Date(), level}
    writeData(data).then(()=>{
      $inputName.value = "";
      $inputMsg.value = "";
      $recordModal.classList.remove("active");
      setTimeout(() => {
        if(confirm("기록이 성공적으로 등록되었습니다. 기록을 확인 하겠습니까?")){
          setRaking(1);
          $modalRank.classList.toggle("active");
        }
      }, 200);
    }).catch(()=>{
      alert("알 수 없는 오류가 발생하였습니다!");
    });
   
  })
  $inputMsg.addEventListener('input',(e)=>{
    $inputMsg.value = e.target.value;
    if($inputMsg.value.replace(/ /g,"").length===0){
      $errMsg.classList.add("active");
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
  /* //기록 모달창 버튼 관련 이벤트 함수 */

  /* 랭킹 모달창 관련 이벤트 함수 */
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
  /* // 랭킹 모달창 관련 이벤트 함수 */

  /*  랭킹 데이터 적용 및 렌더링 */
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
  /* // 랭킹 데이터 적용 및 렌더링 */

  export { setRaking }

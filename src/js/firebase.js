  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
  import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC01cqQ9KW0bDKY5S9-TxQHwvbIo8pPTiU",
    authDomain: "cardgame-2eb81.firebaseapp.com",
    databaseURL: "https://cardgame-2eb81-default-rtdb.firebaseio.com",
    projectId: "cardgame-2eb81",
    storageBucket: "cardgame-2eb81.appspot.com",
    messagingSenderId: "617247459046",
    appId: "1:617247459046:web:589e2a015df6e0d1905d27",
    measurementId: "G-VN0ZR6N49G"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function getRankingData(level) {
    const ranking = collection(db, `ranking${level}`);
    const q = query(
      ranking,
      orderBy("record", "asc"),
      limit(100)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    
    return datas;
  }

 async function writeData(data){
  await addDoc(collection(db, "ranking"+(parseInt(data.level)+1)), {
    ...data
  });
  }

  export {writeData, getRankingData}

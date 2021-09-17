
const firebaseConfig = {
    apiKey: "AIzaSyCxnlbJh2Bo5BQwHnYd-QVwzGy6KdR3wxg",
    authDomain: "practice-fea67.firebaseapp.com",
    projectId: "practice-fea67",
    storageBucket: "practice-fea67.appspot.com",
    messagingSenderId: "191631931916",
    appId: "1:191631931916:web:7f2489116c0b251ff44c29",
    measurementId: "G-WZD2RVXLC1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


let url = window.location.href.split('=')[1];
var docRef = db.collection("restaurants").doc(url);
docRef.get().then((doc) => {
    if (doc.exists) {
        document.write(`<h1>Name of Restaurant: ${doc.data().name}</h1>`);
    } else {
        // doc.data() will be undefined in this case
        document.write("<h1>No such restaurant</h1>");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var uid = user.uid;
        var docRef = db.collection("users").doc(uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data().status == "User")
                    location.href = "user.html";
                else {
                    document.body.style.display = "block";
                    callOrders(uid);
                }

            } else {
                location.href = "index.html";
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        location.href = "index.html";
    }
});

const callOrders = (uid) => {
    db.collection(`users/${uid}/orders`).orderBy("time", "asc")
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    showOrders(change.doc);
                }
            });
        });
}

const showOrders = (doc) => {
    const table = document.getElementById("myTable");
    const row = table.insertRow(-1);
    const cell1 = row.insertCell(0);
    cell1.setAttribute("class", "column1");
    const cell2 = row.insertCell(1);
    cell2.setAttribute("class", "column2");
    const cell3 = row.insertCell(2);
    cell3.setAttribute("class", "column3");
    const cell4 = row.insertCell(3);
    cell4.setAttribute("class", "column4");
    const cell5 = row.insertCell(4);
    cell5.setAttribute("class", "column5");
    // const cell6 = row.insertCell(5);
    // cell6.setAttribute("class", "column6");
    cell1.innerHTML = doc.id;
    cell2.innerHTML = doc.data().time.toDate();
    cell3.innerHTML = doc.data().buyer;
    cell4.innerHTML = doc.data().dishName;
    cell5.innerHTML = doc.data().restuarantName;
    // cell6.innerHTML = "NEW CELL6";
}

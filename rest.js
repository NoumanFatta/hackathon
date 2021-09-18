
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const id = window.location.href.split('=')[1];
let restuarantName;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const uid = user.uid;
        let docRef = db.collection("users").doc(uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data().status != "User") {
                    location.href = "admin.html";
                }
                else {
                    document.body.style.display = "block";
                    greetUser(doc);
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        location.href = "index.html";
    }
});

db.collection("restaurants").doc(id).get().then((doc) => {
    if (doc.exists) {
        restuarantName = doc.data().name;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});



let docRef = db.collection("restaurants").doc(id);
docRef.get().then((doc) => {
    if (doc.exists) {
        db.collection(`restaurants/${id}/dishes`).get().then(querySnapshot => {
            const documents = querySnapshot.docs.map(doc => doc.data())
            if (documents.length == 0) {
                document.getElementById("availableRestaurants").innerText = "No dishes for now"
            }
            else {
                document.getElementById("availableRestaurants").innerText = "Here are some available dishes"
                db.collection(`restaurants/${id}/dishes`).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        showDishes(doc);
                    });
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
        })
    } else {
        // doc.data() will be undefined in this case
        document.write("<h1>No such restaurant</h1>");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

const greetUser = (doc) => {
    const greet = document.getElementById("greet");
    greet.innerText = doc.data().fName + " " + doc.data().lName;
}

const showDishes = (doc) => {
    const row = document.getElementsByClassName("row")[1];
    const col = document.createElement("div");
    col.setAttribute("class", "col");
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("style", "width:18rem");
    const img = document.createElement("img");
    img.setAttribute("src", doc.data().url);
    img.setAttribute("class", "card-img-top");
    img.setAttribute("style", "width:18rem; height:18rem;")
    card.appendChild(img);
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    const cardTitle = document.createElement("h5");
    cardTitle.innerText = doc.data().name;
    cardBody.appendChild(cardTitle);
    const orderButton = document.createElement("button");
    orderButton.setAttribute("type", "button");
    orderButton.setAttribute("id", doc.data().name);
    orderButton.setAttribute(`onclick`, `order('${doc.data().ownerID}','${doc.data().name}')`);
    orderButton.setAttribute("class", "btn btn-primary");
    orderButton.innerText = "Order Now";
    cardBody.appendChild(orderButton);
    card.appendChild(cardBody);
    cardTitle.setAttribute("class", "card-title")
    col.appendChild(card);
    row.appendChild(col);

}

const order = (ownerID, dishName) => {
    const btn = document.getElementById(dishName);
    btn.innerText = "Ordering";
    btn.setAttribute("disabled", "disabled");
    document.body.style.cursor = "progress";
    const user = firebase.auth().currentUser;
    // Add a new document in collection "cities"
    db.collection(`users/${ownerID}/orders`).doc().set({
        buyer: user.email,
        dishName: dishName,
        restuarantName,
        time: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            btn.innerText = "Order Now";
            btn.removeAttribute("disabled");
            document.body.style.cursor = "auto";
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

const logout = () => {
    firebase.auth().signOut().then(() => {
        document.write("logging out..");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    }).catch((error) => {
        // An error happened.
    });
}
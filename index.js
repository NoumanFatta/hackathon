
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const user = firebase.auth().currentUser;
        const fName = document.getElementById("firstName").value;
        const lName = document.getElementById("lastName").value;
        const city = document.getElementById("city").value;
        const country = document.getElementById("country").value;
        const number = document.getElementById("number").value;
        var status = document.getElementById("option").value;
        var docRef = db.collection("users").doc(user.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data().status == "User")
                    window.location.href = "user.html";
                else
                    window.location.href = "admin.html";
            } else {
                db.collection("users").doc(user.uid).set({
                    email: user.email, fName, lName, city, country, number, status
                })
                    .then(() => {
                        alert("Account sucesfully created!");
                        if (status == "User")
                            window.location.href = "user.html";
                        else
                            window.location.href = "admin.html";
                    })
                    .catch((error) => {
                        alert("Error writing document: ", error);
                    });
            }
        })
    } else {
        document.body.style.display = "block";
    }
});
const signIn = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });
}

const signUp = () => {
    const email = document.getElementById("useremail").value;
    const password = document.getElementById("userpassword").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });
}

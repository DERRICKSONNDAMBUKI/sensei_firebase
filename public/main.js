// console.log(firebase);
const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();
// one-time operation

// stream of operations
auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello, ${user.displayName}!</h3> <p>Email: ${user.email}</p> <p> User ID: ${user.uid}</p> `;
  } else {
    // not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});

// firestore
const db = firebase.firestore();

const createThing = document.getElementById("createThing");
const thingList = document.getElementById("thingsList");

createThing.onclick = () => {
  console.log("Hello");
};

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    thingsRef = db.collection("things");
    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;

      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(),
      });
      console.log(thingsRef.name);
    };
    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}`;
        });
        thingList.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe();
  }
});
// ricky has bugs

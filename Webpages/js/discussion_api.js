import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAdCufvmFN1m5PUm7ZtyTBHKh7WTIQfHYM",
    authDomain: "profile-98f53.firebaseapp.com",
    projectId: "profile-98f53",
    storageBucket: "profile-98f53.firebasestorage.app",
    messagingSenderId: "44472759931",
    appId: "1:44472759931:web:0380a0c00a63c592c614de"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

let currentUser = null;

// 🔹 Handle Authentication State & Fetch Username
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("post-message-form").style.display = "block";

    // 🔹 Fetch username from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      currentUser = {
        uid: user.uid,
        username: userDoc.data().username || "Anonymous"
      };
    } else {
      currentUser = {
        uid: user.uid,
        username: "Anonymous"
      };
    }
  } else {
    document.getElementById("post-message-form").style.display = "none";
    currentUser = null;
  }
});

// 🔹 Fetch and Display Discussions
function fetchDiscussions() {
  const messagesContainer = document.getElementById("messages-container");
  messagesContainer.innerHTML = "";

  const q = query(collection(db, "discussions"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      messagesContainer.innerHTML += `<div><strong>${data.username}</strong>: ${data.message}</div>`;
    });
  });
}

fetchDiscussions();

// 🔹 Post Message (Fixed)
document.getElementById("post-message-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const message = document.getElementById("message-input").value.trim();
  if (!message) return;

  if (!currentUser) {
    alert("You must be logged in to post a message.");
    return;
  }

  await addDoc(collection(db, "discussions"), {
    username: currentUser.username,  // ✅ Correctly fetching username now
    message: message,
    timestamp: new Date()
  });

  document.getElementById("message-input").value = "";
});

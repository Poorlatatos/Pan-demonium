import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// Firebase Config (Must be the same as in your other pages)
const firebaseConfig = {
    apiKey: "AIzaSyAdCufvmFN1m5PUm7ZtyTBHKh7WTIQfHYM",
    authDomain: "profile-98f53.firebaseapp.com",
    projectId: "profile-98f53",
    storageBucket: "profile-98f53.firebasestorage.app",
    messagingSenderId: "44472759931",
    appId: "1:44472759931:web:0380a0c00a63c592c614de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

// **Check User Authentication State**
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Display Email
        userEmail.textContent = user.email;

        // **Fetch Username from Firestore**
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            userName.textContent = userDoc.data().username;
        } else {
            userName.textContent = "No Username Set";
        }
    } else {
        window.location.href = "index.html";
    }
});
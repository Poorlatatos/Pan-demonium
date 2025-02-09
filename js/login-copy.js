// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
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

// **DOM Elements**
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const modal = document.getElementById("auth-modal");
const closeModal = document.querySelector(".close");
const toggleAuth = document.getElementById("toggle-auth");
const modalTitle = document.getElementById("modal-title");
const profileNav = document.getElementById("profile-nav");

// **Open Login Modal**
loginBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// **Close Modal**
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// **Close Modal when clicking outside**
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// **Toggle Between Login & Signup**
toggleAuth.addEventListener("click", () => {
    if (modalTitle.textContent === "Login") {
        modalTitle.textContent = "Sign Up";
        document.getElementById("username").style.display = "block";
        toggleAuth.innerHTML = 'Already have an account? <span>Login</span>';
    } else {
        modalTitle.textContent = "Login";
        document.getElementById("username").style.display = "none";
        toggleAuth.innerHTML = 'Don\'t have an account? <span>Sign Up</span>';
    }
});

// Handle Login / Signup
document.getElementById("auth-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const usernameInput = document.getElementById("username"); // Username field
    const username = usernameInput.value.trim();

    if (document.getElementById("modal-title").textContent === "Sign Up") {
        if (!username) {
            alert("Please enter a username!");
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            // **Save Username in Firestore**
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: user.email
            });

            console.log("User signed up & username saved:", user);
            
            // ✅ Redirect to profile page after sign-up
            window.location.href = "../profile.html";
        })
        .catch((error) => console.error("Signup error:", error.message));
    } else {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed in:", userCredential.user);

            // ✅ Redirect to profile page after login
            window.location.href = "../profile.html";
        })
        .catch((error) => console.error("Login error:", error.message));
    }
});


// **Monitor Authentication State**
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        profileNav.style.display = "inline";  // Show profile link
        loginBtn.style.display = "none";  // Hide login button
        logoutBtn.style.display = "inline";  // Show logout button
    } else {
        console.log("User is logged out");
        profileNav.style.display = "none";  // Hide profile link
        loginBtn.style.display = "inline";  // Show login button
        logoutBtn.style.display = "none";  // Hide logout button
    }
});

// **Handle Logout**
logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("User signed out");
    }).catch((error) => {
        console.error("Logout error:", error.message);
    });
});
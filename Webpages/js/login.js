const apiKey = "679f353274defa5166181f1d";
const dbUrl = "https://kepperland-f9be.restdb.io/rest/profile";

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const profileNav = document.getElementById("profile-nav");
const modal = document.getElementById("auth-modal");
const closeBtn = document.querySelector(".close");
const authForm = document.getElementById("auth-form");
const toggleAuth = document.getElementById("toggle-auth");
const modalTitle = document.getElementById("modal-title");
const usernameField = document.getElementById("username");
const authMessage = document.getElementById("auth-message");
const postMessageForm = document.getElementById("post-message-form"); // For discussion board

// Check if user is logged in
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    profileNav.style.display = "block"; // Show profile button
    if (postMessageForm) postMessageForm.style.display = "block"; // Show discussion post form
}

// 🔹 Open Modal
loginBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// 🔹 Close Modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    authMessage.textContent = ""; // Clear messages
});

// 🔹 Toggle between Login/Signup
toggleAuth.addEventListener("click", () => {
    if (usernameField.style.display === "none") {
        usernameField.style.display = "block";
        modalTitle.textContent = "Sign Up";
        toggleAuth.innerHTML = `Already have an account? <span>Login</span>`;
    } else {
        usernameField.style.display = "none";
        modalTitle.textContent = "Login";
        toggleAuth.innerHTML = `Don't have an account? <span>Sign Up</span>`;
    }
});

// 🔹 Handle Authentication
authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const username = usernameField.value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (modalTitle.textContent === "Sign Up") {
        // 🔹 Check if email already exists
        const checkResponse = await fetch(`${dbUrl}?q={"email":"${email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            }
        });

        const existingUsers = await checkResponse.json();
        if (existingUsers.length > 0) {
            authMessage.textContent = "This email is already in use. Please log in.";
            authMessage.style.color = "red";
            return;
        }

        // 🔹 Signup Request
        const signupResponse = await fetch(dbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            },
            body: JSON.stringify({ username, email, password })
        });

        if (signupResponse.ok) {
            authMessage.textContent = "Account created! Please log in.";
            authMessage.style.color = "green";
            setTimeout(() => toggleAuth.click(), 1000); // Switch to Login
        } else {
            authMessage.textContent = "Error creating account.";
            authMessage.style.color = "red";
        }
    } else {
        // 🔹 Login Request
        const response = await fetch(`${dbUrl}?q={"email":"${email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            }
        });

        const users = await response.json();
        if (users.length > 0 && users[0].password === password) {
            localStorage.setItem("user", JSON.stringify(users[0])); // Store user data
            authMessage.textContent = "Login successful! Redirecting...";
            authMessage.style.color = "green";

            profileNav.style.display = "block"; // Show profile button
            if (postMessageForm) postMessageForm.style.display = "block"; // Show discussion form

            setTimeout(() => {
                window.location.href = "profile.html"; // Redirect to profile page
            }, 1000);
        } else {
            authMessage.textContent = "Invalid email or password.";
            authMessage.style.color = "red";
        }
    }
});

// 🔹 Logout Function
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    profileNav.style.display = "none"; // Hide profile button
    if (postMessageForm) postMessageForm.style.display = "none"; // Hide discussion form
    window.location.href = "index.html"; // Redirect to homepage after logout
});

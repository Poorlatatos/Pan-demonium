const apiKey = "679f353274defa5166181f1d";
const dbUrl = "https://kepperland-f9be.restdb.io/rest/profile";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "index.html"; // Redirect to homepage if not logged in
}

// Set the logged-in user's name and email on the profile page
document.getElementById("userName").innerText = user.username;
document.getElementById("userEmail").innerText = user.email;

// Fetch user profile data from restdb.io
function fetchUserProfile(userId) {
    fetch(`${dbUrl}/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            "x-apikey": apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            // Handle other profile data if needed
        } else {
            alert('Profile not found');
        }
    });
}

if (user) {
    // If the user is logged in, hide the login button and show the logout button
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("profile-nav").style.display = "block"; // Show profile nav link
    document.getElementById("userName").innerText = user.username;
    document.getElementById("userEmail").innerText = user.email;
} else {
    // If the user is not logged in, show the login button and hide the logout button
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("profile-nav").style.display = "none"; // Hide profile nav link
}

// Logout function
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("profile-nav").style.display = "none"; // Hide profile nav link
    window.location.href = "index.html"; // Redirect to homepage after logout
});

// Fetch and display the user's profile data
fetchUserProfile(user._id); // Pass the logged-in user's ID from local storage
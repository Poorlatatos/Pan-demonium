document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; // In production, hash passwords before sending

    const apiKey = "679e46087a314f601beead6e"; // Replace with your actual API key
    const dbUrl = "https://profile-e106.restdb.io/rest/contact"; // Replace with your database URL

    try {
        // Fetch user from database
        const response = await fetch(`${dbUrl}?q={"email": "${email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            }
        });

        const users = await response.json();

        if (users.length > 0) {
            const user = users[0];

            if (user.password === password) { // In production, compare hashed passwords
                localStorage.setItem("user", JSON.stringify(user)); // Store user info in localStorage
                document.getElementById("message").textContent = "Login successful!";
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // Redirect to dashboard
                }, 1000);
            } else {
                document.getElementById("message").textContent = "Incorrect password!";
            }
        } else {
            document.getElementById("message").textContent = "User not found!";
        }
    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("message").textContent = "An error occurred!";
    }
});
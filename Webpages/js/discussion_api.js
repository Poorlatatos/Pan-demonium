const messagesDbUrl = "https://kepperland-f9be.restdb.io/rest/discussion"; // Database for messages
const apiKey = "679f353274defa5166181f1d"; // Same API key

const user = JSON.parse(localStorage.getItem("user"));
const postForm = document.getElementById("post-message-form");
const messageInput = document.getElementById("message-input");
const messagesContainer = document.getElementById("messages-container");

// 🔹 SHOW POST FORM IF USER IS LOGGED IN
if (user) {
    postForm.style.display = "block";
}

// 🔹 FETCH & DISPLAY MESSAGES
async function fetchMessages() {
    try {
        const response = await fetch(messagesDbUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            }
        });
        const messages = await response.json();
        messagesContainer.innerHTML = ""; // Clear previous messages

        messages.forEach(msg => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.innerHTML = `
                <p><strong>${msg.username}</strong>: ${msg.message}</p>
                <span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>
            `;
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

// 🔹 POST A NEW MESSAGE
postForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    const messageData = {
        username: user.username, // Get logged-in user's name
        message: messageText,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(messagesDbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            },
            body: JSON.stringify(messageData)
        });

        if (response.ok) {
            messageInput.value = ""; // Clear input field
            fetchMessages(); // Refresh messages
        } else {
            console.error("Error posting message");
        }
    } catch (error) {
        console.error("Error posting message:", error);
    }
});

// 🔹 LOAD MESSAGES WHEN PAGE LOADS
fetchMessages();

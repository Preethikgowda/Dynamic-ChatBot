document.addEventListener("DOMContentLoaded", function (e) {
    let chatbotName = "";
    let chatLog = document.getElementById("chat-log");
    let sendBtn = document.getElementById("send-btn");
    let userInput = document.querySelector(".user-input");
    let clearButton = document.getElementById('clear-btn');
    let chatHistoryBtn = document.getElementById('chatHistory-btn');

    // Replace with the actual server URL where your server.js is running
    const serverUrl = "http://localhost:3000/api/chat";

    function showWelcomeMessage(chatName) {
        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = `Welcome to ${chatName}! How can I assist you today?`;
    }

    function generateChatbotName() {
        const adjectives = ["Amazing", "Brilliant", "Creative", "Dynamic", "Energetic"];
        const nouns = ["Bot", "Assistant", "Companion", "Guide", "Helper"];

        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${randomAdjective} ${randomNoun}`;
    }

    function setChatBotName() {
        chatbotName = generateChatbotName();
        document.querySelector(".chatbot-name").textContent = chatbotName;
        document.title = chatbotName;
        showWelcomeMessage(chatbotName);
    }

    setChatBotName();

    sendBtn.addEventListener("click", async function () {
        let userMessage = userInput.value.trim();
        if (userMessage !== "") {
            if (!checkInternetConnection()) {
                displayMessage("error", "Sorry, you're offline. Please check your internet connection.");
                return;
            } else {
                try {
                    displayMessage("sent", userMessage);
                    let response = await sendChatMessage(userMessage);
                    if (response) {
                        displayMessage("received", response);
                        scrollChatLog();
                    } else {
                        console.error("Error: No response received from server.");
                    }
                } catch (error) {
                    console.error(error);
                    displayMessage("error", "Error: Failed to fetch response from the server.");
                } finally {
                    userInput.value = ""; // Clear input field after sending message
                }
            }
        }
    });

    async function sendChatMessage(message) {
        showLoadingIndicator();
        try {
            const response = await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            hideLoadingIndicator();

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("No response from server (404)");
                } else {
                    throw new Error(`Error: ${response.statusText}`);
                }
            }

            const responseData = await response.json();
            return responseData.response; // Return the actual response from the server
        } catch (error) {
            hideLoadingIndicator();
            console.error(error);
            displayMessage("error", error.message);
            throw error;
        }
    }

    function displayMessage(type, message) {
        let messageContainer = document.createElement("div");
        messageContainer.classList.add("message", type);
        let messageText = document.createElement("p");
        messageText.textContent = message;
        messageContainer.appendChild(messageText);
        chatLog.insertBefore(messageContainer, chatLog.firstChild); // Add new messages to the top
    }

    function checkInternetConnection() {
        return navigator.onLine;
    }

    function showLoadingIndicator() {
        document.getElementById("loading-indicator").style.display = "flex";
    }

    function hideLoadingIndicator() {
        document.getElementById("loading-indicator").style.display = "none";
    }

    function scrollChatLog() {
        chatLog.scrollTop = 0; // Scroll to the top to see the latest message
    }

    async function fetchChatHistory() {
        try {
            const response = await fetch('/api/chat-history');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return null;
        }
    }

    function displayChatHistory(chatHistory) {
        chatLog.innerHTML = ''; // Clear existing chat

        chatHistory.forEach(chat => {
            let messageContainer = document.createElement("div");
            messageContainer.classList.add("message", 'sent');
            let messageText = document.createElement("p");
            messageText.textContent = chat.userMessage;
            messageContainer.appendChild(messageText);
            messageContainer.addEventListener("click", () => {
                chatLog.innerHTML = ''; // Clear chat log
                displayMessage('sent', chat.userMessage);
                displayMessage('received', chat.aiResponse);
                showBackButton();
            });
            chatLog.appendChild(messageContainer);
        });
    }

    function showBackButton() {
        let backButton = document.createElement("button");
        backButton.textContent = "Back";
        backButton.addEventListener("click", () => {
            fetchChatHistory()
                .then(chatHistory => {
                    displayChatHistory(chatHistory);
                })
                .catch(error => {
                    console.error('Error fetching chat history:', error);
                    displayMessage('error', 'Failed to fetch chat history');
                });
        });
        chatLog.appendChild(backButton);
    }

    chatHistoryBtn.addEventListener('click', () => {
        fetchChatHistory()
            .then(chatHistory => {
                displayChatHistory(chatHistory);
            })
            .catch(error => {
                console.error('Error fetching chat history:', error);
                displayMessage('error', 'Failed to fetch chat history');
            });
    });

    clearButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/chat-history', { method: 'DELETE' });
            if (response.ok) {
                chatLog.innerHTML = ''; // Clear the chat log
            } else {
                console.error('Error clearing chat history:', response.statusText);
            }
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    });
});

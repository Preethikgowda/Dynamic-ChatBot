document.addEventListener("DOMContentLoaded", function (e) {
    let chatbotName = "";
    let chatLog = document.getElementById("chat-log");
    let scrollPosition = 0;
    let sendBtn = document.getElementById("send-btn");
    let userInput = document.querySelector(".user-input");
    const serverUrl = "http://localhost:3000/api/chat"; // Update to your server URL if different

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

    function processSpecialCommand(command) {
        if (command === "/help") {
            displayMessage("sent", "You can ask questions or seek assistance. How may I help you?");
        } else if (command === "/about") {
            displayMessage("sent", "I am a chatbot designed to assist you. Feel free to ask me anything!");
        } else {
            displayMessage("sent", "I'm sorry, I don't understand that command. Type /help for assistance.");
        }
    }

    sendBtn.addEventListener("click", async function () {
        let userMessage = userInput.value.trim();
        if (userMessage !== "") {
            if (!checkInternetConnection()) {
                displayMessage("error", "Sorry, you're offline. Please check your internet connection.");
                return;
            } else {
                if (userMessage.startsWith("/")) {
                    const command = userMessage.toLowerCase();
                    processSpecialCommand(command);
                } else {
                    try {
                        displayMessage("sent", userMessage);
                        let response = await sendChatMessage(userMessage);
                        if (response) {
                            displayMessage("received", response.response);
                            scrollChatLog();
                        }
                    } catch (error) {
                        console.error(error);
                        displayMessage("error", "Error: Failed to fetch response from the server.");
                    }
                    userInput.value = "";
                }
            }
        }
    });

    async function sendChatMessage(message) {
        showLoadingIndicator();
        try {
            let response = await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });
            hideLoadingIndicator();
            if (!response.ok) {
                throw new Error("An error occurred while sending the chat message.");
            }
            let responseData = await response.json();
            return responseData;
        } catch (error) {
            hideLoadingIndicator();
            console.error(error);
            throw error;
        }
    }

    function displayMessage(type, message) {
        let messageContainer = document.createElement("div");
        messageContainer.classList.add("message", type);
        let messageText = document.createElement("p");
        messageText.textContent = message;
        messageContainer.appendChild(messageText);
        chatLog.appendChild(messageContainer);
        chatLog.scrollTop = chatLog.scrollHeight;
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
        let isScrolledToBottom = chatLog.scrollHeight - chatLog.clientHeight <= chatLog.scrollTop + 1;
        chatLog.scrollTop = chatLog.scrollHeight;
        if (isScrolledToBottom) {
            restoreScrollPosition();
        }
    }

    function restoreScrollPosition() {
        chatLog.scrollTop = scrollPosition;
    }
});

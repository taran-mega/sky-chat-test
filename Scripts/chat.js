// Get Data from HTML
const messagesBox = document.getElementById("messages");
const usernameBox = document.getElementById("username");
const avatarBox = document.getElementById("avatar");

// Get Data from URL
const params = new URLSearchParams(window.location.search);

// Get Variables from params
const id = params.get("id");
const username = params.get("username");

// Function for Initializing Components
function init(){
    
    // Change Elements Values of HTML
    usernameBox.textContent = username;
    avatarBox.textContent = username.charAt(0).toUpperCase();
}

// Function for Adding Message
function addMessage(message, type){
    
    // Create Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    
    // Create Message Div
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    
    // Add Content
    bubble.textContent = message;
    
    // Append Child(s)
    messageDiv.appendChild(bubble);
    messagesBox.appendChild(messageDiv);
}

// Call Initial Function(s)
init();
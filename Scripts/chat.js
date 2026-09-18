// Get Data from HTML
const messagesBox = document.getElementById("messages");
const usernameBox = document.getElementById("username");
const avatarBox = document.getElementById("avatar");
const bar = document.getElementById("bar");
const backBtn = document.getElementById("back");

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

// Function for Sending Message from User
function sendMessage(){
    
    // Take Value
    const msg = bar.value;
    
    // Add Message on Screen
    addMessage(msg, "sent");
    
    // Clear Value from bar
    bar.value = "";
}

// Function for make btn(s) working
function activeBtns(){
    
    // Make Back Btn Working
    backBtn.onclick = () => {
        history.back();
    }
}

// Make Controls for Keyboard
window.addEventListener("keydown", (event) => {
    
    // "Enter"
    if (event.key === "Enter"){
        sendMessage();
    }
});

// Call Initial Function(s)
init();
activeBtns();
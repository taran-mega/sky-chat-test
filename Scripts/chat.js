// Get Data from HTML
const messagesBox = document.getElementById("messages");
const usernameBox = document.getElementById("username");
const avatarBox = document.getElementById("avatar");
const bar = document.getElementById("bar");
const backBtn = document.getElementById("back");
const sendingCircle = document.getElementById("sendingCircle");
const sendingText = document.querySelector("#send-btn #text");

// Get Data from URL
const params = new URLSearchParams(window.location.search);

// Get Variables from params
const id = params.get("id");
const username = params.get("username");

// Variables
const API_URL = "https://sky-chat-backend-bl9g.onrender.com";

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

// Function to send message to backend
async function sendToBackend(msg, receiver_id){
    
    // Start Animation
    sendingText.style.display = "none";
    sendingCircle.style.display = "block";
    
    // Make Controller
    const controller = new AbortController();
    
    // Try to fetch
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/send-message`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    receiver_id: receiver_id,
                    message: msg
                })
            }
        );
    
        // Make Json
        const data = await response.text();
        addMessage(data, "sent")
    
        // Return Data
        return data;
    }
    
    // Catch Error
    catch(error){}
    
    // Final Clause
    finally{
        
        // End sending Animation
        sendingCircle.style.display = "none";
        sendingText.style.display = "flex";
    }
}

// Function for Sending Message from User
async function sendMessage(){
    
    // Take Value
    const msg = bar.value.trim;
    
    // Check Value of Message
    if (!msg) return;
    
    // Add Message on Screen
    const response = await sendToBackend(id, msg);
    
    // Check Success
    if (response.success){
        
        // Add Message To Screen
        
        // Clear Value from bar
        bar.value = "";
    }
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
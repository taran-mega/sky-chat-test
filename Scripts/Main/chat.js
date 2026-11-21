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

// Function for Editing HTML Components
function editHTML(){

    // Change Elements Values of HTML
    usernameBox.textContent = username;
    avatarBox.textContent = username.charAt(0).toUpperCase();
}

// Function for Adding Message
function addMessage(msg, type){  

    // Create Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    // Create Message Div
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    
    // Add Content
    bubble.textContent = msg;

    // Append Child(s)
    messageDiv.appendChild(bubble);
    messagesBox.appendChild(messageDiv);
    
    // Scroll to Bottom
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Function for Updating RAM on new message arrived
function updateRAM(data){
    
    const messages = JSON.parse(sessionStorage.getItem("messages") || "[]]");
    message = {
        id: data.id,
        message: data.message,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        created_at: data.created_at
    }
    messages.push(message);
    sessionStorage.setItem("messages", JSON.stringify(messages));
}

// Function to send message to backend
async function sendToBackend(receiver_id, msg){

    // Start Animation
    sendingText.style.display = "none";
    sendingCircle.style.display = "block";

    // Try to fetch
    try{

        // Fetch URL
        const response = await fetch(
            `${API_URL}/message/send`,
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
        const data = await response.json();

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
    const msg = bar.value.trim();
    
    // Clear Value from bar
    bar.value = "";
    bar.focus();
        
    // Check Value of Message
    if (!msg) return;
    
    // Add Message on Screen
    addMessage(msg, "sent");
    
    try{
        
        // Send Message to Backend
        const response = await sendToBackend(id, msg);
    
        // Check Success
        if (response.success){
        
            // Update RAM
            updateRAM(response.content);
        }
        else{
            addMessage("An unexpected error happen on backend", 'error');
        }
    }
    
    catch(error){
        addMessage("An unexpected error happen on backend", 'error');
    }
}

// Function for awakening Server
async function serverWakeUp(){

    // Fetch URL
    const response = await fetch(
        `${API_URL}`,
        {
            method: "GET"
        }
    );

    // Convert Response to JSON
    const data = await response.json();

    // Check Server Result
    if (data.success){

        // Load Main Content
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("chat").style.display = "flex";
    }
}

// Function to Load Message on Screen
async function loadMessages(){
    
    // Get Data from Session Storage
    const data = JSON.parse(sessionStorage.getItem("messages"));
    
    // For Every Item
    data.forEach((item) => {
        
        // Validate Contact Messages
        if (String(item.sender_id) === String(id) || String(item.receiver_id) === String(id)){
            
            // Check Type
            const type = String(item.sender_id) === String(id)? "received": "sent";
        
            // Add Message on Screen
            addMessage(item.message, type);
        }
    });
}

// Function for Adding Event Listener for Communicating with socket.jd
function listenSocketJS(){
    
    // Create Event Listener for Adding new Messages
    window.addEventListener("new_message_arrived", (event) =>{
        
        //
        const data = event.detail;
        updateRAM(data);
        addMessage(data.message, "received");
    });
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

// Function for Call All Initial Function(s)
async function init(){

    // Before Server Wake-up
    activeBtns();

    // After Server Wake-up
    editHTML();
    loadMessages();
    
    // Call Socket Function
    listenSocketJS();
    if (sessionStorage.getItem("isAuthentic") === "true"){
        connectSocket();
    }
}

// Call Initial Function
init();
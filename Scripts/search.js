// Get Data from HTML
const searchBar = document.getElementById("search-bar");
const resultArea = document.getElementById("results");

// Request(s) Controller
let controller = null;

// URLs
const API_URL = "https://sky-chat-backend-bl9g.onrender.com";

// Function for Start/End loading animation
function toggleLoading(type = "start"){
    
    // If "start"
    if (type === "start"){
        document.querySelector("#search-area #search-btn #text").style.display = "none";
        document.querySelector("#search-area #search-btn .loadingCircle").style.display = "block";
    }
    
    // If "end"
    else if (type === "end"){
        document.querySelector("#search-area #search-btn #text").style.display = "block";
        document.querySelector("#search-area #search-btn .loadingCircle").style.display = "none";
    }
    
    // If not defined well
    else{
        console.log("Animation toggling argument is not defined well.");
    }
}

// Function for Making Connection
async function makeConnection(id, btn, is_connected){
    
    // Change btn Content
    if (!is_connected){
        btn.textContent = "Requesting";
    }
    
    // Make Controller
    const controller = new AbortController();
    
    // Try to fetch
    try{
    
        // Make Request
        const response = await fetch(
            `${API_URL}/connection/request`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    target_id: id
                }),
                signal: controller.signal
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // If Connected
        if (data.success){
        
            // Change btn Content
            btn.textContent = "Requested";
        }
        else{
        
            // Change btn Content
            btn.textContent = "+ Connect";
        }
    }
    
    // Catch Error(s)
    catch(error){
        
        // Change btn Content
        btn.textContent = "+ Connect";
        
    }
}

// Function to adding User on screen
function addUserToScreen(id, username, is_connected){
    
    // Make MainElement
    const div = document.createElement("div");
    div.className = "result";
    
    // Make Left Content
    const leftDiv = document.createElement("div");
    
    // Make Right Button
    const btn = document.createElement("button");
    
    // Add Data into Left Content
    leftDiv.textContent = username;
    
    // Check User Connection
    if (is_connected){
        btn.textContent = "Connected";
    }
    else{
        btn.textContent = "+ Connect";
    }
    
    // Add Event Listener to button
    btn.addEventListener("click", () => {
        makeConnection(id, btn, is_connected);
    })
    
    // Attach Result with Results Screen
    div.appendChild(leftDiv);
    div.appendChild(btn);
    resultArea.appendChild(div);
}

// Function for sending request to backend
async function sendToBackend(){
    
    // Cancel Previous Request
    if(controller){controller.abort();}
    
    // Make Controller for new request
    controller = new AbortController();    
    
    // Start Animation
    toggleLoading("start");
    
    // Try Request
    try{
        
        // Establish Connection
        const response = await fetch(
            `${API_URL}/search-users`,
            {
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    input: searchBar.value
                }),
                signal: controller.signal
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Check Success
        if(data.success){
        
            // For Every item in Response
            for (let item of data.content){
        
                // Add to Screen
                addUserToScreen(item.id, item.username, item.is_connected);
            }
        }
    }
    
    // Handle Error(s)
    catch(error){
        
        // Abort Error
        if(error.name === "AbortError"){
            console.log("previous request is cancelled.");
            return;
        }
        
        // Other Error(s)
        console.error(error);
    }
    
    // Finally
    finally{
        
        // End Loading
        toggleLoading("end");
    }
}

// Function for Sending Request from frontend
async function sendRequest(){
    
    // Clear Results
    resultArea.innerHTML = "";
   
    // Send To Backend
    await sendToBackend();
}

// Make Control for Keyboard
window.addEventListener("keydown", (event) => {
    
    // "ENTER" key
    if (event.key === "Enter"){
        sendRequest();
    }
});
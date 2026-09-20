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
async function makeConnection(main, left, btn){
    
    // Extract Data from HTML element
    const id = main.dataset.id;
    const is_connected = main.dataset.isConnected === "true";
    const is_connection_request_sent = main.dataset.isConnectionRequestSent === "true";
    const is_connection_request_received = main.dataset.isConnectionRequestReceived === "true";
    
    // Check Conditions
    if (!is_connected &&
        !is_connection_request_sent &&
        !is_connection_request_received
    ){
        // Change btn Content
        btn.textContent = "Requesting";
    
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
                    })
                }
            );
        
            // Convert Response into JSON
            const data = await response.json();
            
            left.textContent = JSON.stringify(data);
            
            // If Connected
            if (data.success){
                
                // Update Element Data
                main.dataset.isConnectionRequestSent = "true";
                
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
}

// Function to adding User on screen
function addUserToScreen(item, data){
    
    // Take Data from Arguments
    const id = item.id;
    const username = item.username;
    const is_connected = item.is_connected;
    const is_connection_request_sent = item.is_connection_request_sent;
    const is_connection_request_received = item.is_connection_request_received;
    
    // Make Main Element
    const div = document.createElement("div");
    div.className = "result";
    
    // Make Left Content
    const leftDiv = document.createElement("div");
    
    // Make Right Button
    const btn = document.createElement("button");
    
    // Store Data
    div.dataset.id = id;
    div.dataset.isConnected = is_connected;
    div.dataset.isConnectionRequestSent = is_connection_request_sent;
    div.dataset.isConnectionRequestReceived = is_connection_request_received;
    
    // Add Data into Left Content
    leftDiv.textContent = JSON.stringify(data);
    
    // Check User Connection
    if (is_connected){
        btn.textContent = "Connected";
    }
    else if (is_connection_request_sent){
        btn.textContent = "Requested";
    }
    else if (is_connection_request_received){
        btn.textContent = "Accept";
    }
    else{
        btn.textContent = "+ Connect";
    }
    
    // Add Event Listener to button
    btn.addEventListener("click", () => {
        makeConnection(div, leftDiv, btn);
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
                addUserToScreen(item, data);
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
function sendRequest(){
    
    // Clear Results
    resultArea.innerHTML = "";
   
    // Send To Backend
    sendToBackend();
}

// Make Control for Keyboard
window.addEventListener("keydown", (event) => {
    
    // "ENTER" key
    if (event.key === "Enter"){
        sendRequest();
    }
});
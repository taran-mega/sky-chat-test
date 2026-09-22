// Get Data From HTML
const requestsSent = document.querySelector("#viewport #slider #sent");
const requestsReceived = document.querySelector("#viewport #slider #received");

// URLs
const API_URL = "https://sky-chat-backend-bl9g.onrender.com";

// Function for adding requests on Screen
function addRequest(item){
    
    // Create Variables
    const username = item.username;
    const type = item.type;
    
    // Create Div(s)
    const div = document.createElement("div");
    const leftDiv = document.createElement("div");
    const btnsDiv = document.createElement("div");
    const acceptBtn = document.createElement("div");
    const rejectBtn = document.createElement("div");
    const sentBtn = document.createElement("div");
    
    // Modify Class(s) & id(s)
    div.className = "request";
    leftDiv.id = "left-div";
    btnsDiv.id = "btns-div";
    acceptBtn.id = "accept-btn";
    rejectBtn.id = "reject-btn";
    sentBtn.id = "sent-btn";
    
    // Add Content Into Div(s)
    leftDiv.textContent = username;
    acceptBtn.textContent = "accept";
    rejectBtn.textContent = "reject";
    sentBtn.textContent = "sent";
    
    // Check Type
    if (type === "sent"){
        
        // Append Child(s)
        btnsDiv.appendChild(sentBtn);
        requestsSent.appendChild(div);
    }
    else if (type === "received"){
        
        // Append Child(s)
        btnsDiv.appendChild(acceptBtn);
        btnsDiv.appendChild(rejectBtn);
        requestsReceived.appendChild(div);
    }
    
    // Append Child(s)
    div.appendChild(leftDiv);
    div.appendChild(btnsDiv);
}

// Function for Selecting Current Panel
function selectPanel(panel, sentBtn, receivedBtn){
    
    // Get Data From HTML
    const slider = document.getElementById("slider");
    
    // Check Panel Type
    if (panel === "sent"){
        
        // Change Position
        slider.style.transform = "translateX(0%)";
        
        // Modify Classes
        sentBtn.classList.add("active");
        receivedBtn.classList.remove("active");
    }
    else if (panel === "received"){
        
        // Change Position
        slider.style.transform = "translateX(-50%)";
        
        // Modify Classes
        receivedBtn.classList.add("active");
        sentBtn.classList.remove("active");
    }
}

// Function for Toggling between two panels
function togglePanel(){
    
    // Get Data From HTML
    const sentBtn = document.querySelector("#panel #sent");
    const receivedBtn = document.querySelector("#panel #received");
    const viewport = document.getElementById("viewport");
    const slider = document.getElementById("slider");
    
    // Add Event Listener to Viewport for Touch Start
    viewport.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
    });
    
    // Add Event Listener to Viewport for Touch Moving
    viewport.addEventListener("touchmove", (event) => {
        
        // Make Variable
        const currentX = event.touches[0].clientX;
        const difference = touchStartX - currentX;
        
        // Move Slider
        slider.style.transform = `translateX(${difference})`;
    });
    
    // Add Event Listener to Viewport for Touch End
    viewport.addEventListener("touchend", (event) => {
        
        // Create Variable
        const touchEndX = event.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;
        
        // Check Different from start
        if (Math.abs(difference) < 50) return;
        
        // Swipe to "Sent" Side
        if (difference < 0){
            selectPanel("sent", sentBtn, receivedBtn);
        }
        
        // Swipe to "Received" Side
        else if (difference > 0){
            selectPanel("received", sentBtn, receivedBtn);
        }
    });
    
    // Add Event Listener to Sent Btn
    sentBtn.addEventListener("click", () => {
        selectPanel("sent", sentBtn, receivedBtn);
    });
    
    // Add Event Listener to Received Btn
    receivedBtn.addEventListener("click", () => {
        selectPanel("received", sentBtn, receivedBtn);
    });
}

// Function to ask backend about requests
async function sendToBackend(){
    
    // Try to Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/requests`,
            {
                method: "GET",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        requestsSent.textContent = JSON.stringify(data, null, 2);
        
        // Check Success
        if (!data.success) return;
        
        // Iter Content
        for (let item of data.content.sent_requests){
            
            // Add Request
            addRequest(item, "sent");
        }
        for (let item of data.content.received_requests){
            
            // Add Request
            addRequest(item, "received");
        }
    }
    
    // Catch Error 
    catch(error){
        requestsSent.textContent = error;
    }
}

// Function for Sending Message to Parents
function sendToParent(){
    
    // Animation Message
    window.parent.postMessage({
        type: "tab",
        tab: "requests"
    }, "*");
}

// Function for Calling all Initial Functions
function init(){
    
    // Functions
    sendToParent();
    togglePanel();
    
    // Call Backend
    sendToBackend();
}

// Call Initial Function
init();
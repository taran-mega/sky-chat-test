// Get Data from HTML
const contactsList = document.getElementById("contacts-list");
const emptyState = document.getElementById("empty-state");

// Variable
const API_URL = "https://sky-chat-backend-bl9g.onrender.com";
    
// Function to connect current contact with chat.html
function chooseContact(){
    
    // Add Event Listener in Contacts List
    contactsList.addEventListener("click", (event) => {
        
        // Choose Contacts
        const contact = event.target.closest(".contact");
        
        // Check Contact Existance
        if (!contact) return;
        
        // Make Variables
        const id = contact.dataset.id;
        const username = contact.dataset.username;
        
        // Open Chat.html
        window.top.location.href = "chat.html?id=" + 
                               encodeURIComponent(id) +
                               "&username=" +
                               encodeURIComponent(username);
    });
}

// Function for adding Contact on Screen by frontend
function addContact(id, username){
    
    // Create Div
    const div = document.createElement("div");
    div.className = "contact";
    
    // Add Content
    div.textContent = username;
    div.dataset.id = id;
    div.dataset.username = username;
    
    // Add To Screen
    contactsList.appendChild(div);
    
    // Hide Empty State
    emptyState.style.display = "none";
}

// Function for sending request to backend for getting Contacts
async function sendToBackend(){
    
    // Make Controller
    const controller = new AbortController();
    
    // Fetch URL
    const response  = await fetch(
        `${API_URL}/get-contacts`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    
    // Convert Response into JSON
    const data = await response.json();
    
    // Check Success
    if (!data.success) return;
    
    // Load Main Content
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
    
    // Try Iter
    try{
    
        // Loop Over the Response
        for (let item of data.content){
        
            // Add To Contact
            addContact(item.id, item.username);
        }
    }
    
    // Catch Error
    catch(error){}
}

// Function for Sending Message to Parents
function sendToParent(){
    
    // Animation Message
    window.parent.postMessage({
        type: "tab",
        tab: "contacts"
    }, "*");
}


// Function to Call Initial Function
function init(){
    
    // Before Server Wake-up
    sendToParent();
    
    // Server Wake-up
    sendToBackend();
    
    // After Server Wake-up
    chooseContact();
}

// Call Initial Function
init();
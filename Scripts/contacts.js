// Get Data from HTML
const contactsList = document.getElementById("contacts-list");
const emptyState = document.getElementById("empty-state");

// Function for adding Contact on Screen
function addContact(username){
    
    // Create Div
    const div = document.createElement("div");
    div.className = "contact";
    
    // Add Content
    div.textContent = username;
    
    // Add To Screen
    contactsList.appendChild(div);
    
    // Hide Empty State
    emptyState.style.display = "none";
}

// Function for sending request to backend
async function sendToBackend(){
    
    // Variable
    API_URL = "https://sky-chat-backend-bl9g.onrender.com";
    
    // Make Controller
    const controller = new AbortController();
    
    // Fetch URL
   const response  = await fetch(
        `${API_URL}/get-contacts`,
        {
            method: "GET",
            credentials: "include",
            signal: controller.signal
        }
    );
    
    // Convert Response into JSON
    const data = await response.json();
    
    // Return Response
    return data;
}

// Function for Managing Request
async function manageRequest(){
    
    // Send Request to Backend
    const response = await sendToBackend();
    
    // Loop Over the Response
    for (let item of response){
        
        // Add To Contact
        addContact(item.username);
    }
}

// Initial function
manageRequest();
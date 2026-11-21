// Get Data from HTML
const contactsList = document.getElementById("contacts-list");
const emptyState = document.getElementById("empty-state");

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
    contactsList.style.display = "block";
}

// Function to Load Message from Backend
async function loadMessages(){

    // Try To Fetch
    try{

        // Fetch URL
        const response = await fetch(
            `${API_URL}/message/load-all`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        // Convert Data into JSON
        const data = await response.json();

        // Check Success
        if (!data.success) return;
        
        // Store Messages in Session Storage
        sessionStorage.setItem("messages", JSON.stringify(data.content));
    }

    // Catch Error(s)
    catch(error){}
}


// Function to add Event Listeners
function addEventListeners(){
    
    // Event Listener for Adding Contacts
    window.addEventListener("add_contacts", (event) => {
        
        // Loop Over data
        for (item of event.detail){
            
            // Add Contacts
            addContact(item.id, item.username);
        }
        
        //  Show Main Content
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    });
}

// Function for Sending Message to Parents
function sendToParent(){

    // Animation Message
    window.parent.postMessage({
        type: "tab",
        tab: "contacts"
    }, "*");
}

// Function for Calling Server Related Functions
function serverFun(){
    loadMessages();
}

// Function to Call Initial Function
function init(){
    
    sendToParent();
    addEventListeners();
    
    // Server Related Functions
    serverFun();
    
    chooseContact();
}

// Call Initial Function
init();

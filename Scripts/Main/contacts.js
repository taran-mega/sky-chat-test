// Get Data from HTML
const page = document.getElementById("page");
const panelSlider = document.querySelector("#panel .animated-background");

// Function for Handling Page
function handlePage(){
    
    // Get Data from HTML
    const requestsBtn = document.querySelector("#panel #requests");
    const contactsBtn = document.querySelector("#panel #contacts");
    
    // Change Src Initially
    page.src = "current-contacts.html";
    
    // Add Event Listener to Btns for Changing Source of Oage
    requestsBtn.addEventListener("click", () => {
        page.src = "requests.html";
    });
    contactsBtn.addEventListener("click", () => {
        page.src = "current-contacts.html";
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

// Function for Calling all Initial function
async function init(){
    
    // Functions
    handlePage();
    sendToParent();
}

// Call Initial Function
init();

// Add a Event Listener to Move Animation
window.addEventListener("message", (event) => {
    
    // Check Data Type
    if (!event.data.type === "tab") return;
    
    // Check Current Tab & Move Animation Tab
    if (event.data.tab === "requests"){
        panelSlider.style.left = "0%";
    }
    else if (event.data.tab === "contacts"){
        panelSlider.style.left = "50%";
    }
});
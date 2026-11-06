// Get Data from HTML
const page = document.getElementById("page");
const panelSlider = document.querySelector("#panel .animated-background");

// Function(s) to change main page from Panel
function openContacts(){page.src = "contacts.html";}
function openSearch(){page.src = "search.html";}

// Function for Adjusting Panel Animation
function modifyPanelAnimation(){
    
    // Get Data from HTML
    const searchBtn = document.querySelector("#panel #search-btn");
    const contactsBtn = document.querySelector("#panel #contacts-btn");
    const settingsBtn = document.querySelector("#panel #settings-btn");
    
    // Modify Style
    panelSlider.style.width = 100 / 3 + "%";
    panelSlider.style.left = 100 / 3 + "%";
}

// Call Initial Functions
function init(){
    
    // Change Page Location
    page.src = "contacts.html";
    
    // Function(s)
    modifyPanelAnimation();
}
init();

// Add a Event Listener to Move Animation
window.addEventListener("message", (event) => {
    
    // Check Data Type
    if (!event.data.type === "tab") return;
    
    // Check Current Tab & Move Animation Tab
    if (event.data.tab === "search"){
        panelSlider.style.left = "0%";
    }
    else if (event.data.tab === "contacts"){
        panelSlider.style.left = (100 / 3) + "%";
    }
    else if (event.data.tab === "settings"){
        panelSlider.style.left = ((100 / 3) * 2) + "%";
    }
});
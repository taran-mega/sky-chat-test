// Function for sending request to backend for getting Contacts Details
async function askForContacts(){

    // Fetch URL
    const response  = await fetch(
        `${API_URL}/contact/get-all`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    // Convert Response into JSON
    const data = await response.json();

    // Check Success
    if (!data.success) return;
    
    // Save Data in Session Storage
    sessionStorage.setItem("contacts", JSON.stringify(data.content));
    
    // Dispatch Event
    window.dispatchEvent(
        new CustomEvent("add_contacts", {
            detail: data.content
        })
    );
}

// Function for Calling Server Related Functions
function serverFun(){
    askForContacts();
}

// Function for Calling all Initial Functions
function init(){
    
    serverFun();
}

// Call Initial Function
init();
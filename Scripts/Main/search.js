// Get Data from HTML
const searchBar = document.getElementById("search-bar");
const resultArea = document.getElementById("results");

// Request(s) Controller
let controller = null;

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
        console.error("Animation toggling argument is not defined well.");
    }
}

// Function for Updating Buttons
function updateButtons(btnsDiv, id, state){

    // Replace Old Items
    btnsDiv.replaceChildren();

    // Check User Connection
    if (state.isConnected){

        // Make Btn
        const btn = new Button("connected");

        // Add Task
        btn.addTask(() => {
            openPanel(
                "Remove connection?",
                "Do you want to remove this connection?",
                "Remove",
                () => {
                    return false;

                    // Call Update Function
                    updateButtons(btnsDiv, id, state);
                }
            );
        });

        // Modify Btn
        btn.changeSizes({txtSize: "12px", bgWidth: "80px", bgHeight: "30px"});
        btn.changeColors({bgColor: "#37337b"});

        // Append in Parent
        btn.appendInParent(btnsDiv);
    }
    else if (state.isConnectionRequestSent){

        // Make Btn
        const btn = new Button("Requested");

        // Add Task
        btn.addTask(() => {
            openPanel(
                "Cancel Request?",
                "Do you want to cancel this connection?",
                "Cancel Request",
                async () => {

                    // Call Request Handler
                    const success = await cancelRequest(id);

                    // Check Success
                    if (success){
                        state.isConnectionRequestSent = false;

                        // Call Update Function
                        updateButtons(btnsDiv, id, state);
                    }

                    // Return Success
                    return success;
                }
            );
        });

        // Modify Btn
        btn.changeSizes({txtSize: "12px", bgWidth: "80px", bgHeight: "30px"});
        btn.changeColors({bgColor: "#37337b"});

        // Append in Parent
        btn.appendInParent(btnsDiv);
    }
    else if (state.isConnectionRequestReceived){

        // Make Btn
        const yesBtn = new Button("accept");
        const noBtn = new Button("ignore");

        // Add Task
        yesBtn.addTask(async () => {

            // Call Request Handler
            const success = await acceptRequest(id);

            // Check Success
            if (success) {
                state.isConnected = true;
                state.isConnectionRequestReceived = false;

                // Call Update Function
                updateButtons(btnsDiv, id, state);
            }

            // Return Success
            return success;
        });

        // Add Task
        noBtn.addTask(async () => {

            // Call Request Handler
            const success = await rejectRequest(id);

            // Check Success
            if (success) {
                state.isConnectionRequestReceived = false;

                // Call Update Function
                updateButtons(btnsDiv, id, state);
            }

            // Return Success
            return success;
        });

        // Modify Btn
        yesBtn.changeSizes({txtSize: "12px", bgWidth: "80px", bgHeight: "30px"});
        noBtn.changeSizes({txtSize: "12px", bgWidth: "80px", bgHeight: "30px"});
        noBtn.changeColors({bgColor: "#37337b"});

        // Append in Parent
        yesBtn.appendInParent(btnsDiv);
        noBtn.appendInParent(btnsDiv);
    }
    else{

        // Make Btn
        const btn = new Button("+ Connect");

        // Add Task
        btn.addTask(async () => {

            // Call Request Handler
            const success = await sendRequest(id);

            // Check Success
            if (success){
                state.isConnectionRequestSent = true;

                // Call Update Function
                updateButtons(btnsDiv, id, state);
            }

            // Return Success
            return success;
        });

        // Append in Parent
        btn.appendInParent(btnsDiv);

        // Modify Btn
        btn.changeSizes({txtSize: "12px", bgWidth: "80px", bgHeight: "30px"});
    }
}

// Function to adding User on screen
async function addUserToScreen(item){

    // Take Data from Arguments
    const id = item.id;
    const username = item.username;
    const state = {
        isConnected: item.is_connected,
        isConnectionRequestSent: item.is_connection_request_sent,
        isConnectionRequestReceived: item.is_connection_request_received,
    };

    // Make Main Element
    const div = document.createElement("div");

    // Make Size Div(s)
    const leftDiv = document.createElement("div");
    const btnsDiv = document.createElement("div");

    // Add Classes and IDs
    div.className = "result";
    btnsDiv.id = "btnsDiv";

    // Add Data into Left Content
    leftDiv.textContent = username;

    // Call Update Function Initially
    updateButtons(btnsDiv, id, state);

    // Attach Result with Results Screen
    div.appendChild(leftDiv);
    div.appendChild(btnsDiv);
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
                addUserToScreen(item);
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
function search(){

    // Clear Results
    resultArea.innerHTML = "";

    // Send To Backend
    sendToBackend();
}

// Function for Sending Message to Parents
function sendToParent(){

    // Animation Message
    window.parent.postMessage({
        type: "tab",
        tab: "search"
    }, "*");
}

// Function for Calling All Initial Function(s)
function init(){

    // Function
    sendToParent();
}

// Call Initial Function
init();

// Make Control for Keyboard
window.addEventListener("keydown", (event) => {

    // "ENTER" key
    if (event.key === "Enter"){
        sendRequest();
    }
});

/*
// Test Functions
addUserToScreen({
    id: 12,
    username: "putin",
    is_connected: true,
    is_connection_request_sent: false,
    is_connection_request_received: false
});
addUserToScreen({
    id: 2,
    username: "hitler",
    is_connected: false,
    is_connection_request_sent: true,
    is_connection_request_received: false
});
addUserToScreen({
    id: 14,
    username: "meloni",
    is_connected: false,
    is_connection_request_sent: false,
    is_connection_request_received: true
});
addUserToScreen({
    id: 143,
    username: "kim jon",
    is_connected: false,
    is_connection_request_sent: false,
    is_connection_request_received: false
});
*/

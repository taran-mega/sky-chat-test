//////////     SOCKET LIBRARY URL     ///////////

// https://cdn.socket.io/4.8.1/socket.io.min.js


// Function for Making Socket
function createSocket(){

    // Create Socket.IO Client
    window.skySocket = io(API_URL, {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
    });

    // Socket Event Listener for Connection Established
    window.skySocket.on("connect", () => {
        alert("Socket Connected");
    });

    // Socket Event Listener for Connection Error
    window.skySocket.on("connect_error", (error) => {
        alert("Socket Connection Error");
    });

    // Socket Event Listener for Disconnect
    window.skySocket.on("disconnect", (reason) => {
        alert("Socket Disconnect");
    });
}

// Function for Connecting Socket
function connectSocket() {
    if (!window.skySocket.connected) {
        window.skySocket.connect();
    }
}

// Function for Disconnecting Socket
function disconnectSocket() {
    if (window.skySocket.connected) {
        window.skySocket.disconnect();
    }
}

// Function for Making Socket Event Listener for New Message Delivery
function socketMessageDelivery(){

    // Socket Event Listener for New Arrived Message
    window.skySocket.on("new_message_delivery", (message) => {
        
        // Notify other frontend scripts
        window.dispatchEvent(
            new CustomEvent("new_message_arrived", {
                detail: message
            })
        );
    });
}

// Function for Calling all Initial Functions
function init(){

    createSocket();
    socketMessageDelivery();
}

// Call Initial Function
init();
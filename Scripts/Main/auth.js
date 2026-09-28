// Get Data from HTML
const loadingScreen = document.getElementById("loadingScreen");
const container = document.getElementById("container");
const username = document.getElementById("username");
const password = document.getElementById("password");
const sendBtn = document.getElementById("sendBtn");
const sendBtnTxt = document.querySelector("#sendBtn p");
const sendBtnCircle = document.querySelector("#sendBtn div");
const usernameError = document.getElementById("username-error");
const passwordError = document.getElementById("password-error");
const subHeading = document.querySelector("#container #box #header p");
const toggleText = document.querySelector("#toggle-text p");
const toggleBtn = document.querySelector("#toggle-text button");

// Variables
action = "sign-up";

// Function for toggling between sign-up and log-in
function toggleAction(){
    
    // Check Current action
    if (action === "sign-up"){
        
        // Change Action
        action = "log-in";
        
        // Change HTML
        subHeading.textContent = "Login to your existing account";
        sendBtnTxt.textContent = "Log in";
        toggleText.textContent = "Not have an account yet?";
        toggleBtn.textContent = "sign up";
    }
    else{
        
        // Change Action
        action = "sign-up";
        
        // Change HTML
        subHeading.textContent = "Create your new account";
        sendBtnTxt.textContent = "Sign up";
        toggleText.textContent = "Already have an account?";
        toggleBtn.textContent = "log in";
    }
}

// Function for adding Error Message
function addError(elementPrefix, text){
    
    try{
        // Find Target
        const target = document.getElementById(`${elementPrefix}-error`);
        
        // Add Text
        target.textContent = `* ${text}`;
    }
    catch{}
}

// Function for sending request to backend
async function sendToBackend(){
    
    const response = await fetch(
        `${API_URL}/auth`, {
            
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
                action: action
            })
        }
    )
    
    // Convert to JSON
    const data = await response.json();
    
    // Make Logs
    console.log(JSON.stringify(data, null, 2));
    
    // Check Response type
    if (data.type === "error"){
        
        // Add Error
        addError(data.cause, data.message);
    }
    
    // Return Success
    return data.success;
}

// Function for Sending Request from frontend
async function sendRequest(){
    
    // Start Animation
    sendBtnTxt.style.display = "none";
    sendBtnCircle.style.display = "block";
    
    // Reset Errors
    usernameError.textContent = "";
    passwordError.textContent = "";
    
    // Send Request
    const response = await sendToBackend();
    
    // Check Response
    if (response){
        
        // Clear Values
        username.value = "";
        password.value = "";
    }
    
    // End Animation
    sendBtnTxt.style.display = "block";
    sendBtnCircle.style.display = "none";
    
    // Check Response
    if (response){
        
        // Redirect
        window.location.href = "panel.html"
    }
}
// Get Data from HTML
const loadingCircle = document.getElementById("loading");

// Function to check authentication of user
async function checkAuth(){
    
    // Make Request
    const response = await fetch(
        `${API_URL}/is-auth`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    
    // Convert Response into JSON
    const data = await response.json();
    
    // Check Success
    if (data.success){
        
        window.location.href = "panel.html";
    }
    else{
        window.location.href = "auth.html";
    }
}

// call initial function(s)
checkAuth();

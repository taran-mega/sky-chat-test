// Get Data from HTML
const loadingCircle = document.getElementById("loading-circle");
const body = document.body;

// Function to check authentication of user
async function checkAuth(){

    // Try to Execute
    try{
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
            sessionStorage.setItem("isAuthentic", "true");
        }
        else{
            window.location.href = "auth.html";
        }
    }

    // Catch Error
    catch (error){}
}

// call initial function(s)
checkAuth();
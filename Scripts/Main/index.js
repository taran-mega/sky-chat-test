// Get Data from HTML
const loadingCircle = document.getElementById("loading");
const body = document.body;

body.style.color = "white";
body.style.fontSize = "20px";

// Function to check authentication of user
async function checkAuth(){

    // Try to Execute
    try{
        body.textContent = "function called";

        // Make Request
        const response = await fetch(
            `${API_URL}/is-auth`,
            credentials: "include",
            {
                method: "GET"
            }
        );

        // Convert Response into JSON
        const data = await response.json();

        body.textContent = JSON.stringify(data);

        // Check Success
        if (data.success){

            window.location.href = "panel.html";
        }
        else{
            window.location.href = "auth.html";
        }
    }

    // Catch Error
    catch (error){

        // Add Error to Loading Screen
        body.textContent = error;
    }
}

// call initial function(s)
checkAuth();
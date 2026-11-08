// Get Data from HTML
const loadingCircle = document.getElementById("loading-circle");
const body = document.body;

body.style.color = "white";
body.style.fontSize = "20px";

// Function to check authentication of user
async function checkAuth(){
    alert('fun called');

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

        alert('request made');

        // Convert Response into JSON
        const data = await response.json();

        // Check Success
        if (data.success){

            window.location.href = "panel.html";
            alert('panel.html');
        }
        else{
            window.location.href = "auth.html";
            alert('auth.html');
        }
    }

    // Catch Error
    catch (error){

        // Add Error to Loading Screen
        alert(error);
    }
}

// call initial function(s)
checkAuth();

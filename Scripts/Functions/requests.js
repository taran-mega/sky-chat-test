// Function for Sending a request
async function sendRequest(id){
    
    // Try to Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/request/send/${id}`,
            {
                method: "POST",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Return Success
        return data.success;
    }
    
    // Catch Error
    catch(error){
        return false;
    }
}


// Function for Accepting a request
async function acceptRequest(id){
    
    // Try to Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/request/accept/${id}`,
            {
                method: "POST",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Return Success
        return data.success;
    }
    
    // Catch Error
    catch(error){
        return false;
    }
}

// Function for Rejecting a request
async function rejectRequest(id){

    // Try to Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/request/reject/${id}`,
            {
                method: "POST",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Return Success
        return data.success;
    }
    
    // Catch Error
    catch(error){
        return false;
    }
}


// Function for Cancelling a Request
async function cancelRequest(id){
    
    // Try To Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/request/cancle/${id}`,
            {
                method: "POST",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Return Success
        return data.success;
    }
    
    // Catch Error
    catch(error){
        return false;
    }
}
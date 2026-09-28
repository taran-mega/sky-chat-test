// Function for Accepting a request
async function acceptRequest(id, callback){
    console.log('accept')
    // Try to Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/request/accept/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Check Status
        if (!data.success) return;
        
        // Callback
        callback();
    }
    
    // Catch Error
    catch(error){}
}

// Function for Rejecting a request
async function rejectRequest(id){
    console.log('reject')
    // Try to Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/request/reject/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Check Status
        if (!data.success) return;
        
        // Callback
        callback();
    }
    
    // Catch Error
    catch(error){}
}


// Function for Cancelling a Request
async function cancleRequest(id){
    console.log('cancle')
    // Try To Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/connection/request/cancle/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Check Status
        if (!data.success) return;
        
        // Callback
        callback();
    }
    
    // Catch Error
    catch(error){}
}
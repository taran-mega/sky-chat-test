// Function for Cancellind Request
async function cancleConnectionRequest(id){
    
    // Try To Fetch URL
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );
        
        // Convert Response into JSON
        const data = await response.json();
        
        // Return Success
        data.success
    }
    
    // Catch Error
    catch(error){}
}
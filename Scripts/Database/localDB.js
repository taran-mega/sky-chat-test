// Configures
const DB_NAME = "skyChatDB";
const DB_VERSION = 1;

// Initial Variables
let dbInstance = null;

// Function for Opening Data
function openSkyChatDB(){
    
    // Return Promise (asynchronous)
    return new Promise((resolve, reject) => {
        
        if (dbInstance){
            resolve(dbInstance);
            return;
        }
        
        // Make Database Request
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        // Constructor Database Structure
        request.onupgradeneeded = (event) => {
            
            // Assign Database
            const db = event.target.result;
            
            // 'MESSAGES' store object
            if (!db.objectStoreNames.contain('messages')){
                
                // Create Store
                const messageStore = db.createObjectStore(
                    "messages",
                    {
                        keyPath: ["user_id", "id"]
                    }
                );
                
                // Create Store Index
                messageStore.createIndex(
                    "conversation",
                    ["user_id", "contact_id", "id"],
                    {unique: false}
                );
            }
            
            // 'CONVERSATIONS' store oject
            if (!db.storeObjectNames.contain("conversations")){
                
                // Create Store Object
                db.createObjectStore(
                    "conversations",
                    {
                        keyPath: ["user_id", "contact_id"]
                    }
                );
            }
        };
        
        // On Request Success
        request.onsuccess = () => {
            
            // Assign Database Instance
            dbInstance = request.result;
            
            // On Database Instance Version Change
            dbInstance.onversionchange = () => {
                
                // Close Database Instance
                dbInstance.close();
                dbInstance = null;
            }
            
            // Resolve
            resolve(dbInstance);
        };
        
        // On Request Error
        request.onerror = () => {
            
            // Reject Request
            reject(request.error);
        };
        
        // On Request Block
        request.onblocked = () => {
            alert("Database Upgrade is blocked");
        };
    });
}

// Function for Saving Messages
async function saveMessage(user_id, contact_id, messages){
    
    // Open Database
    const db = await openSkyChatDB();
    
    // Return Promise (asynchronous)
    return new Promise((resolve, reject) => {
        
        // Make Texture Transaction with Database
        const tx = db.transaction(
            ["messages", "conversations"],
            "readwrite"
        );
        
        // Open Stores
        const messageStore = tx.objectStore("messages");
        const conversationStore = tx.objectStore("conversations");
        
        // Variables
        let latestId = 0;
        
        // Loop Over 'Messages'
        for (const message of messages){
            
            // Make Id
            const messageId = Number(message.id);
            
            // Check for Valid ID
            if (!Number.isSafeInteger(messageId) || messageId <= 0){
                
                // Abort Texture
                tx.abort();
                reject(new Error("Invalid Message ID"));
                return;
            }
            
            // Assign Latest ID
            latestId = Math.max(latestId, messageId);
            
            // Put Message in 'MESSAGES' Store
            messageStore.put({
                ...message,
                id: messageId,
                user_id: Number(userId),
                contact_id: Number(contactId)
            });
            
            // Check for latest Id
            if (latestId > 0){
                
                // Get Data from Conversation Store
                const key = [Number(userId), Number(contactId)];
                const request = conversationStore.get(key);
                
                // On Request Success
                request.onsuccess = () => {
                    
                    // Prepare Conversation Data
                    const conversation = request.result || {
                        
                        user_id: Number(userId),
                        contact_id: Number(contactId),
                        latest_message_id: 0
                    };
                    
                    // Update Last Message Id
                    conversation.last_message_id = Math.max(
                        conversation.last_message_id,
                        latestId
                    );
                    
                    // Put new data into Conversation Store
                    conversationStore.put(conversation);
                };
            }
            
            
        }
    });
}
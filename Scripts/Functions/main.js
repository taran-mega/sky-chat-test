// Class for Making Button
class Button{
    
    // Constructor
    constructor(txt){
        
        // Create Button Element
        this.btn = document.createElement("button");
        this.btn.className = "button";
        
        // Modify it Content
        this.btn.textContent = txt;
    }
    
    // Method To append Div in Parent
    appendInParent(parent){
        
        // Declare Object Arguments
        //this.parent = parent;
        
        // Append in Parent
        parent.appendChild(this.btn);
    }
    
    // Method to take task from Button
    addTask(callback, {waitForResponse = true} = {}){
        
        // Add Event Listener
        this.btn.addEventListener("click", async () => {
            
            // Check Waiting Condition
            if (waitForResponse){
                
                // Apply Task Logic
                const success = await callback();
                
                // Take Task After Success
                if (success){
                   
                   try{
                        this.postSuccessTask();
                    }
                    catch(error){}
                }
            }
            else{
                
                try{
                    this.postSuccessTask();
                }
                catch(error){}
            }
        });
    }
    
    // Method to set a After Success Task
    setPostSuccessTask(func){
        
        // Decalre Task
        this.postSuccessTask = func;
    }
    
    // Method to Change Colors
    changeColors({txtColor = "white", bgColor = "#5c40ff"} = {}){
        
        // Change Colors
        this.btn.style.color = txtColor;
        this.btn.style.backgroundColor = bgColor;
    }
    
    // Method to Set New Sizing
    changeSizes({txtSize = "16px", bgWidth = "50px", bgHeight = "20px"} = {}){
        
        // Set Sized
        this.btn.style.fontSize = txtSize;
        this.btn.style.minWidth = bgWidth;
        this.btn.style.height = bgHeight;
    }
}

// Function for Opening Panel
async function openPanel(headingTxt, spanTxt, btnTxt, callback){
    
    // Get Data from HTML
    const body = document.body;
    const oldDiv = document.getElementById("bottom-panel");
    
    if (oldDiv){
        body.removeChild(oldDiv);
    }
    
    // Make Div(s)
    const mainDiv = document.createElement("div");
    const heading = document.createElement("h2");
    const span = document.createElement("span");
    const panelBtns = document.createElement("div");
    
    // Make Buttons
    const yesBtn = document.createElement("button");
    const noBtn = document.createElement("button");
    
    // Modify Classes and IDs
    mainDiv.id = "bottom-panel";
    panelBtns.id = "buttons";
    
    // Modify Buttons
    heading.textContent = headingTxt;
    span.textContent = spanTxt;
    yesBtn.textContent = btnTxt;
    noBtn.textContent = "Do Nothing";
    
    // Append Childs
    panelBtns.appendChild(yesBtn);
    panelBtns.appendChild(noBtn);
    mainDiv.appendChild(heading);
    mainDiv.appendChild(span);
    mainDiv.appendChild(panelBtns);
    body.appendChild(mainDiv);
    
    // Apply Animation to Main Div
    requestAnimationFrame(() => {
        mainDiv.classList.add("show");
    });
    
    // Get Data From HTML
    const btns = document.querySelectorAll("#bottom-panel #buttons button");
    
    // Add Event Listener to Yes Button
    yesBtn.addEventListener("click", async () => {
        const success = await callback();
        
        // Check Success
        if (!success) return;
        
        // Close Panel
        mainDiv.classList.remove("show");
    });
    
    // Add Event Listener to No Button
    noBtn.addEventListener("click", () => {
        mainDiv.classList.remove("show");
    });
}

// Function for Starting Loading Circle
async function startLoading(parent, func){
    
    // Clone Elements from parent
    const parentContent = Array.from(parent.childNodes);
    
    console.log("height", parent.style.height);
    console.log("width", parent.style.width);
    
    // Create Div
    const circle = document.createElement("div");
    const div = document.createElement("div");
    
    // Modify Classes and IDs
    div.id = "loadingScreen";
    circle.className = "loadingCircle";
    
    // Remove all Elements from Parent
    parent.innerHTML = "";
    
    // Append in Parent
    div.appendChild(circle);
    parent.appendChild(div);
    
    // Try to Call Function
    try{
        await func();
    }
    finally{
        
        // Place all copied elements in parent
        parent.replaceChildren(...parentContent);
    }
}
document.addEventListener("DOMContentLoaded", loadNotes);
const add = document.getElementById("add");
const noteInput = document.getElementById("note-input");
const notesList = document.querySelector(".notesList");
const editTodoBtn = document.querySelector(".edit");
add.addEventListener("click", addNote);
notesList.addEventListener("click", function(e) {
  if (e.target.classList.contains("delete")) {
    deleteNote(e);
  }
});
notesList.addEventListener("click", function(e) {
  if (e.target.classList.contains("edit")) {
    editNote(e);
  }
});


function loadNotes() {
    
    fetch('/api/notes')
    .then( (response) => {
        return response.json()
    })
    .then( (notesArray) => {
        renderNotes(notesArray)
    })
    .catch( (error) => {
        console.log("Notes failed to load");
        alert("Failed to load notes", error)
    })
}

function renderNotes (notesArray) {
    notesList.innerHTML = "";
    if (notesArray.length === 0) {
        const createLi = document.createElement("li")
        createLi.textContent = "There are no notes currently" ;
        notesList.appendChild(createLi);
        return;
    };
    
    const arrayLength = notesArray.length;
    for(let i = 0; i < arrayLength; i++)
    { 
    const createLi = document.createElement("li")
    createLi.dataset.id = notesArray[i].id; 

    createLi.innerHTML = `<span class="note-text">${notesArray[i].content}</span>
                            <div>
                                <button class="btn delete">Erase</button>
                                <button class="btn edit">Edit</button>
                            </div>`;

    // createLi.textContent = `${notesArray[i].content}` ;
    notesList.appendChild(createLi);
        
    }
    
};


function addNote() {

    const content = noteInput.value.trim();
   if(content == "") {
        alert("You need to write something!");
        return;
    } else {
         fetch("/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" } ,
            body: JSON.stringify({content: content})
        })
        .then ( (response) => { if (!response.ok) {
             throw new Error ("Unable to complete fetch request");     
        } else {
            return response.json()
        }})
        .then ( () => {noteInput.value= ""; loadNotes()}
        )
        .catch ( (error) => {
            console.error("Error fetching:", error);
        });
    }
    }

function editNote (e) {
    let button = e.target
     
    if (button.classList.contains("edit")) {
        const closestLi = button.closest("li");
        const closestText = closestLi.querySelector(".note-text");
        const newInput = document.createElement("input");
        newInput.value = closestText.textContent
        closestLi.replaceChild(newInput, closestText)

        newInput.addEventListener("keydown", function(e) {
        if ( e.key === "Enter") {
            const id = closestLi.dataset.id
            const editedValue = newInput.value.trim();
            // closestText.textContent = newInput.value
            // closestLi.replaceChild(closestText, newInput);
        if (editedValue === "") {
           alert("Entry cannot be empty")
           return; 
        }
            fetch(`/api/notes/${id}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json" } ,
                body: JSON.stringify({content: editedValue})
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to edit note");
                }
                return response.json();
            })
            .then(() => {
                loadNotes();
            })
            .catch((error) => {
                console.error(error);
            });
            console.log("edit clicked"); 
        }
        }); 
    }}
         
function deleteNote(e) { 
    
    let button = e.target
    if (button.classList.contains("delete")) {
        const closestLi = button.closest("li");
        const id = closestLi.dataset.id 
        fetch(`/api/notes/${id}`, {
            method: "DELETE"
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete note");
            }
            loadNotes();
        })
        .catch((error) => {
            console.error(error);
        });
        console.log("delete clicked");
    }
    
} 
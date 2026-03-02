const add = document.getElementById("add");
const noteInput = document.getElementById("note-input");
const notesList = document.querySelector(".notesList");
const editTodoBtn = document.querySelector(".edit");
add.addEventListener("click", addNote);

notesList.addEventListener("click", (e) => {
  if (e.target.closest(".delete")) {
    deleteNote(e);
  } else if (e.target.closest(".edit")) {
    editNote(e);
  }
});



function addNote() {

   if(noteInput.value.trim() == "") {
        alert("You need to write something!");
} else {
    const createLiEl = document.createElement("li");
    createLiEl.innerHTML = `<span class="note-text">${noteInput.value.trim()}</span>
                            <div>
                                <button class="btn delete">Erase</button>
                                <button class="btn edit">Edit</button>
                            </div>`;
    notesList.appendChild(createLiEl);

}
}


function editNote (e) {
    let button = e.target
    const closestLi = button.closest("li");
    const closestText = closestLi.querySelector(".note-text");
    const newInput = document.createElement("input");
    let eventLocation = e.target
    
    
    if (button.closest(".edit")) {
        newInput.value = closestText.textContent
        closestLi.replaceChild(newInput, closestText)
    }
    
    newInput.addEventListener("keydown", function(e) {
        if ( e.key === "Enter") {

            closestText.textContent = newInput.value
            closestLi.replaceChild(closestText, newInput);

        }
    }) 
         
}

function deleteNote (e) { 
    let button = e.target
    const closestLi = button.closest("li");
    closestLi.remove();


}
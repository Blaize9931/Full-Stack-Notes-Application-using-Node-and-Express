const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const dataFilePath = path.join(__dirname, "data.json");


const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

function writeData (updatedArray) {
    if (!Array.isArray(updatedArray) || !updatedArray.every(note =>   note !== null &&
  typeof note === "object" &&
  Object.prototype.hasOwnProperty.call(note, "id") &&
  Object.prototype.hasOwnProperty.call(note, "content") ) ) {
      throw new Error("writeData expected an array")
    }  
    const data = JSON.stringify(updatedArray, null, 2)
    fs.writeFileSync(dataFilePath, data, "utf8")
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", (req, res) => {
  try {
    const notes = readData();
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load notes" });
  }
});



app.post("/api/notes", (req, res) => {
  const content = req.body.content;

  if (typeof content !== "string") {
    return res.status(400).json({ error: "Content must be a string" });
  }

  const trimmedContent = content.trim();

  if (trimmedContent === "") {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    const notes = readData();

    const newNote = {
      id: String(Date.now()),
      content: trimmedContent
    };

    notes.push(newNote);
    writeData(notes);
    return res.status(201).json({
      message: "Note created",
      data: newNote

    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save note" });
  }
});



app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  try {
    const notes = readData();
    const updatedNotes = notes.filter((note) => note.id !== id);

    if (updatedNotes.length === notes.length) {
      return res.status(404).json({ error: "Note not found" });
    }

    writeData(updatedNotes);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete note" });
  }
});

app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const content = req.body.content;

  if (typeof content !== "string") {
    return res.status(400).json({ error: "Content must be a string" });
  }

  const trimmedContent = content.trim();

  if (trimmedContent === "") {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    const notes = readData();
    const noteToUpdate = notes.find((note) => note.id === id);

    if (!noteToUpdate) {
      return res.status(404).json({ error: "Note not found" });
    }

    noteToUpdate.content = trimmedContent;
    writeData(notes);

    return res.status(200).json({
      message: "Note updated",
      data: noteToUpdate
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update note" });
  }
});
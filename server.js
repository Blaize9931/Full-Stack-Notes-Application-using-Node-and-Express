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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", (req, res) => {
    const data = readData()
    res.send(data);
});

app.post("/api/notes", (req, res) => {
  const newNotes = { id: String(Date.now()), content: req.body["content"] };
  const notes = readData();
  notes.push(newNotes); 
  writeData(notes); 
   res.json({ message: "Data saved successfully", data: newNotes });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params['id'];
  const notes = readData();
  const updatedArray = notes.filter((note) => {
  return note.id !== id; 
  });
  if (updatedArray.length === notes.length) {
    return res.status(404).json({ error: "Note not found" });
  };
  writeData(updatedArray);
  return res.sendStatus(204);
});

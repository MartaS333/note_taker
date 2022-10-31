const express = require("express");
const path = require("path");
const fs = require("fs");
const uuidv1 = require("uuidv1");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sets the front page to the index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Puts you on the notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app
  .route("/api/notes")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
  })
  .post((req, res) => {
    let { title, text } = req.body;
    let newNote = { title, text, id: uuidv1() };

    let notesList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    notesList.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(notesList));
    res.json(notesList);
  });

// This deletes current notes, it wasn't with .router because the ':id'
app.delete("/api/notes/:id", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteId = req.params.id;

  notes = notes.filter((current) => {
    return current.id != noteId;
  });

  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Now running on http://localhost:${PORT}`);
});

import fs from "fs";
import path from "path";

const notesFile = path.join(process.cwd(), "src/storage/notes.json");

const readNotes = () => JSON.parse(fs.readFileSync(notesFile));
const saveNotes = (data) => fs.writeFileSync(notesFile, JSON.stringify(data, null, 2));

export const getNotes = (req, res) => {
  res.json(readNotes());
};

export const addNote = (req, res) => {
  const notes = readNotes();
  const { title, content } = req.body;

  const newNote = { id: Date.now(), title, content };
  notes.push(newNote);
  saveNotes(notes);

  res.json({ message: "Note added", note: newNote });
};

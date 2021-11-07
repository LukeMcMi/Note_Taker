const nt = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { writeToFile, readAndAppend, readFromFile } = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
nt.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting note
nt.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text} = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
    
  } else {
    res.json('Error in posting note');
  }
});

// Get route for a specific note
nt.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
  .then((data) => JSON.parse(data))
  .then((json) => {
    const result = json.filter((note) => note.id === noteId);
    return result.length > 0
    ? res.json(result)
    : res.json("No note with that ID");
  });
});

// Delete route for a specific note
nt.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = nt;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET: Fetch all notes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Upload new note
router.post('/upload', async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title and author required' });

  try {
    const [result] = await db.query(
      'INSERT INTO notes (title, author) VALUES (?, ?)', 
      [title, author]
    );
    res.status(201).json({ success: true, noteId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
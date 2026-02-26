const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection from config
const db = require('./config/db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// 🚀 ALL API ROUTES
// ==========================================

// 0. Base Route (Browser me check karne ke liye)
app.get('/', (req, res) => {
  res.send("✅ Backend is LIVE and RUNNING!");
});

// 1. ATTENDANCE
app.get('/api/attendance', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM attendance');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// 2. CANTEEN (Student Menu & Order)
app.get('/api/canteen/menu', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM canteen_menu');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/canteen/order', async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const [result] = await db.query('INSERT INTO canteen_orders (item_id, quantity, status) VALUES (?, ?, ?)', [itemId, quantity, 'Preparing']);
    res.json({ success: true, orderId: result.insertId });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// 3. ADMIN CANTEEN (Get all orders)
app.get('/api/canteen/orders', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM canteen_orders ORDER BY id DESC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// 4. NOTES SHARING
app.get('/api/notes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notes ORDER BY id DESC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/notes/upload', async (req, res) => {
  try {
    const { title, author } = req.body;
    const [result] = await db.query('INSERT INTO notes (title, author, size) VALUES (?, ?, ?)', [title, author, '1.5 MB']);
    res.json({ success: true, noteId: result.insertId });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running perfectly on http://localhost:${PORT}`);
});
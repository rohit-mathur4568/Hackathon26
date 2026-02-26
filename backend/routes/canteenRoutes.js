const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET: Canteen Menu
router.get('/menu', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM canteen_menu');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Place New Order
router.post('/order', async (req, res) => {
  const { itemId, quantity } = req.body;
  if (!itemId || !quantity) return res.status(400).json({ error: 'Missing data' });

  try {
    const [result] = await db.query(
      'INSERT INTO canteen_orders (item_id, quantity, status) VALUES (?, ?, ?)', 
      [itemId, quantity, 'Preparing']
    );
    res.status(201).json({ success: true, orderId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 📢 1. GET NOTICES (Global + Branch Specific)
router.get('/notices/:branchId', async (req, res) => {
    try {
        // Fetch notices that are meant for EVERYONE (target_branch IS NULL) OR for this specific branch
        const [notices] = await db.query(
            'SELECT * FROM notices WHERE target_branch IS NULL OR target_branch = ? ORDER BY created_at DESC',
            [req.params.branchId]
        );
        res.json(notices);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 🛠️ 2. RAISE HELPDESK TICKET
router.post('/helpdesk', async (req, res) => {
    try {
        const { student_id, category, description } = req.body;
        await db.query(
            'INSERT INTO helpdesk_tickets (student_id, category, description) VALUES (?, ?, ?)',
            [student_id, category, description]
        );
        res.json({ success: true, message: 'Ticket raised successfully. Admin will look into it!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 🍔 3. CANTEEN MENU & ORDER
router.get('/canteen/menu', async (req, res) => {
    try {
        const [menu] = await db.query('SELECT * FROM canteen_menu WHERE is_available = TRUE');
        res.json(menu);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/canteen/order', async (req, res) => {
    try {
        const { student_id, item_id } = req.body;
        await db.query('INSERT INTO canteen_orders (student_id, item_id) VALUES (?, ?)', [student_id, item_id]);
        res.json({ success: true, message: 'Order Placed!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/canteen/orders', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.id, u.name as student_name, m.name as item_name, o.status, o.order_time 
            FROM canteen_orders o 
            JOIN users u ON o.student_id = u.id 
            JOIN canteen_menu m ON o.item_id = m.id 
            ORDER BY o.order_time DESC
        `);
        res.json(orders);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
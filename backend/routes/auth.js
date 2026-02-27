const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔐 1. SMART LOGIN API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and get their Role Name by joining tables
        const query = `
            SELECT u.id, u.name, u.email, u.dept_id, u.branch_id, u.current_semester, r.name as role_name 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.email = ? AND u.password = ?
        `;
        const [users] = await db.query(query, [email, password]);

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid Email or Password!" });
        }

        res.json({ success: true, user: users[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 👑 2. ADD USER (Hierarchy Logic)
router.post('/add-user', async (req, res) => {
    try {
        const { name, email, role_id, dept_id, branch_id, semester, added_by } = req.body;

        await db.query(
            `INSERT INTO users (name, email, role_id, dept_id, branch_id, current_semester, added_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, role_id, dept_id || null, branch_id || null, semester || null, added_by]
        );
        res.json({ success: true, message: `✅ ${name} added successfully!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
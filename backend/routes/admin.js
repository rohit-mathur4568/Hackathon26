const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ==========================================
// 🏢 DEPARTMENTS & BRANCHES
// ==========================================
router.get('/departments', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        res.json(depts);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/add-department', async (req, res) => {
    try {
        const { name } = req.body;
        await db.query('INSERT INTO departments (name) VALUES (?)', [name]);
        res.json({ success: true, message: `✅ Department '${name}' Created!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/branches/:deptId', async (req, res) => {
    try {
        const [branches] = await db.query('SELECT * FROM branches WHERE dept_id = ?', [req.params.deptId]);
        res.json(branches);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/add-branch', async (req, res) => {
    try {
        const { dept_id, name } = req.body;
        await db.query('INSERT INTO branches (dept_id, name) VALUES (?, ?)', [dept_id, name]);
        res.json({ success: true, message: `✅ Branch '${name}' Created!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 👑 POWER FETCH: Get Users by Role, Dept & Branch
// ==========================================
// Yeh route HOD Dashboard aur Director Dashboard dono ke liye kaam karega
router.get('/users/role/:roleId/:deptId', async (req, res) => {
    try {
        const { branch_id } = req.query;
        let query = 'SELECT id, name, email, role_id, dept_id, branch_id, current_semester FROM users WHERE role_id = ? AND dept_id = ?';
        let params = [req.params.roleId, req.params.deptId];

        if (branch_id && branch_id !== 'null') {
            query += ' AND branch_id = ?';
            params.push(branch_id);
        }

        const [users] = await db.query(query, params);
        res.json(users);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 👤 USER MANAGEMENT (Add/Delete)
// ==========================================
router.post('/add-user', async (req, res) => {
    try {
        const { name, email, password, role_id, dept_id, branch_id, semester, added_by } = req.body;

        if (!password) return res.status(400).json({ error: "Password is required!" });

        await db.query(
            `INSERT INTO users (name, email, password, role_id, dept_id, branch_id, current_semester, added_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, password, role_id, dept_id || null, branch_id || null, semester || 1, added_by]
        );
        res.json({ success: true, message: `✅ User '${name}' successfully onboarded!` });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists!' });
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 🗑️ DELETION APIs
// ==========================================
router.delete('/department/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: '✅ Department deleted successfully!' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(400).json({ error: 'Delete linked branches/users first.' });
        res.status(500).json({ error: err.message });
    }
});

router.delete('/branch/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM branches WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: '✅ Branch deleted successfully!' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(400).json({ error: 'Remove users from this branch first.' });
        res.status(500).json({ error: err.message });
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: '✅ User account deleted!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
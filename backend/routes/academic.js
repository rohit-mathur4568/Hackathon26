const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 📊 1. GET ATTENDANCE (For specific student)
router.get('/attendance/:studentId', async (req, res) => {
    try {
        const [attendance] = await db.query('SELECT * FROM attendance WHERE student_id = ?', [req.params.studentId]);
        res.json(attendance);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 📚 2. GET NOTES (Filtered by Branch AND Semester)
router.get('/notes/:branchId/:semester', async (req, res) => {
    try {
        const [notes] = await db.query(
            `SELECT n.*, u.name as author_name 
             FROM notes n 
             JOIN users u ON n.uploaded_by = u.id 
             WHERE n.branch_id = ? AND n.semester = ? 
             ORDER BY n.uploaded_at DESC`,
            [req.params.branchId, req.params.semester]
        );
        res.json(notes);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
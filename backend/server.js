const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
app.use(cors());
app.use(express.json());

// --- DIRECTOR & ADMIN ANALYTICS ---
app.get('/api/admin/department-details/:deptId', async (req, res) => {
    try {
        const [hods] = await db.query('SELECT u.id, u.name, b.name as branch_name FROM users u JOIN branches b ON u.branch_id = b.id WHERE u.dept_id = ? AND u.role_name = "BranchHOD"', [req.params.deptId]);
        const [faculty] = await db.query('SELECT name, email, branch_id FROM users WHERE dept_id = ? AND (role_name = "FACULTY" OR role_name = "Faculty")', [req.params.deptId]);
        const [students] = await db.query('SELECT name, email, branch_id, current_semester FROM users WHERE dept_id = ? AND role_name = "Student"', [req.params.deptId]);
        res.json({ hods, faculty, students });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- FACULTY: ATTENDANCE & NOTES ---
app.post('/api/faculty/mark-attendance', async (req, res) => {
    const { student_id, status, semester } = req.body;
    try {
        await db.query('INSERT INTO attendance (student_id, status, semester, date) VALUES (?, ?, ?, CURRENT_DATE)', [student_id, status, semester]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/faculty/upload-note', async (req, res) => {
    const { title, branch_id, semester, uploaded_by } = req.body;
    try {
        await db.query('INSERT INTO notes (title, branch_id, semester, uploaded_by) VALUES (?, ?, ?, ?)', [title, branch_id, semester, uploaded_by]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- STUDENT: FETCH DATA ---
app.get('/api/student/notes/:branchId/:sem', async (req, res) => {
    try {
        const [notes] = await db.query('SELECT * FROM notes WHERE branch_id = ? AND semester = ?', [req.params.branchId, req.params.sem]);
        res.json(notes);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(5000, () => console.log('🚀 Final System Backend Live on 5000'));
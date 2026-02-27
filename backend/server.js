const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
app.use(cors());
app.use(express.json());

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const academicRoutes = require('./routes/academic');
const facilityRoutes = require('./routes/facility');

// --- HEALTH CHECK (No DB required) ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running', timestamp: new Date() });
});

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/facility', facilityRoutes);

app.listen(5000, () => console.log('🚀 Final System Backend Live on 5000'));
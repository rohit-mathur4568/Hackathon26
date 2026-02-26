const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes Linking
app.use('/api/auth', require('./routes/auth'));
app.use('/api/academic', require('./routes/academic'));
app.use('/api/facility', require('./routes/facility'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/', (req, res) => {
    res.json({ status: '🚀 Ultimate Campus ERP Backend is LIVE!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running perfectly on http://localhost:${PORT}`));
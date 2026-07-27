require('dotenv').config({ debug: false });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dns = require('dns');

// Set reliable public DNS servers to resolve MongoDB SRV records on Windows networks
try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (err) {
    console.warn('⚠️ Could not set custom DNS servers:', err.message);
}

const app = express();

/* ---------- MongoDB CONNECTION ---------- */
mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;

if (!process.env.MONGO_URI) {
    console.warn('⚠️ MONGO_URI is not defined in environment variables');
} else {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB connected'))
        .catch(err => {
            console.error('❌ DB connection error:', err.message);
        });
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 8000;

/* ---------- ROUTES ---------- */

// Root route — health check
app.get('/', (req, res) => {
    res.json({ message: 'BlinkUp Backend API is running 🚀', status: 'online' });
});

// Auth API
const authRouter = require('./routes/auth.js');
app.use('/auth', authRouter);

// Posts API
const postRouter = require('./routes/post.js');
app.use('/posts', postRouter);

// Only listen if executed directly (e.g. node app.js locally)
if (require.main === module) {
    app.listen(PORT, () =>
        console.log(`🚀 Server running → http://localhost:${PORT}`)
    );
}

app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
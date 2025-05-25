require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const ownerRoutes = require('./routes/storeOwner');

// Set CORS before any routes or middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your React app
}));

app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.get('/', (req, res) => {
  res.send('API is running');
});

// 404 handler (must be after all routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler middleware for better debugging
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

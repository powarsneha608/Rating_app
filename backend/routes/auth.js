const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = pwd => /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(pwd);

router.post('/register', async (req, res) => {
  const { name, email, password, address, role } = req.body;
  if (!name || name.length < 20 || name.length > 60)
    return res.status(400).json({ error: 'Name must be 20-60 characters.' });
  if (!address || address.length > 400)
    return res.status(400).json({ error: 'Address max 400 characters.' });
  if (!validatePassword(password))
    return res.status(400).json({ error: 'Password must be 8-16 chars, 1 uppercase, 1 special char.' });
  if (!validateEmail(email))
    return res.status(400).json({ error: 'Invalid email.' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashed, address, role || 'normal']
    );
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (e) {
    if (e.code === '23505') {
      res.status(400).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

router.post('/login', async (req, res) => {
  console.log('POST /login called'); // Debug log
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(400).json({ error: 'Invalid email' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/update-password', require('../middleware/auth')(), async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  if (!validatePassword(newPassword))
    return res.status(400).json({ error: 'Password must be 8-16 chars, 1 uppercase, 1 special char.' });
  const result = await pool.query('SELECT password FROM users WHERE id=$1', [userId]);
  const valid = await bcrypt.compare(oldPassword, result.rows[0].password);
  if (!valid) return res.status(400).json({ error: 'Old password incorrect' });
  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashed, userId]);
  res.sendStatus(200);
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;


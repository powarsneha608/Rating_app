const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

router.get('/dashboard', auth(['admin']), async (req, res) => {
  const users = await pool.query('SELECT COUNT(*) FROM users');
  const stores = await pool.query('SELECT COUNT(*) FROM stores');
  const ratings = await pool.query('SELECT COUNT(*) FROM ratings');
  res.json({ total_users: users.rows[0].count, total_stores: stores.rows[0].count, total_ratings: ratings.rows[0].count });
});

router.post('/create-store', auth(['admin']), async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)',
      [name, email, address, owner_id]
    );
    res.sendStatus(201);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/users', auth(['admin']), async (req, res) => {
  const { name, email, address, role, sort, order } = req.query;
  let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
  const params = [];
  if (name) { params.push(`%${name}%`); query += ` AND name ILIKE $${params.length}`; }
  if (email) { params.push(`%${email}%`); query += ` AND email ILIKE $${params.length}`; }
  if (address) { params.push(`%${address}%`); query += ` AND address ILIKE $${params.length}`; }
  if (role) { params.push(role); query += ` AND role = $${params.length}`; }
  if (sort) query += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`;
  const result = await pool.query(query, params);
  res.json(result.rows);
});

router.get('/stores', auth(['admin']), async (req, res) => {
  const { name, email, address, sort, order } = req.query;
  let query = `SELECT s.*, COALESCE(AVG(r.rating), 0)::FLOAT AS avg_rating
    FROM stores s LEFT JOIN ratings r ON s.id = r.store_id WHERE 1=1`;
  const params = [];
  if (name) { params.push(`%${name}%`); query += ` AND s.name ILIKE $${params.length}`; }
  if (email) { params.push(`%${email}%`); query += ` AND s.email ILIKE $${params.length}`; }
  if (address) { params.push(`%${address}%`); query += ` AND s.address ILIKE $${params.length}`; }
  query += ' GROUP BY s.id';
  if (sort) query += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`;
  const result = await pool.query(query, params);
  res.json(result.rows);
});

router.put('/users/:id', auth(['admin']), async (req, res) => {
  const { name, email, address, role } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE users SET name=$1, email=$2, address=$3, role=$4 WHERE id=$5',
      [name, email, address, role, id]
    );
    res.json({ message: 'User updated successfully!' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;


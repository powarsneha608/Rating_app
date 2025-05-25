const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

router.get('/stores', auth(['normal', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, COALESCE(AVG(r.rating), 0)::FLOAT AS avg_rating
       FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
       GROUP BY s.id`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/rate', auth(['normal']), async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;
  try {
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = $3`,
      [user_id, store_id, rating]
    );
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

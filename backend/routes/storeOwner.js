const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

router.get('/my-store', auth(['store_owner']), async (req, res) => {
  const owner_id = req.user.id;
  const result = await pool.query(
    `SELECT s.*, COALESCE(AVG(r.rating), 0)::FLOAT AS avg_rating
     FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [owner_id]
  );
  res.json(result.rows[0]);
});
router.get('/my-raters', auth(['store_owner']), async (req, res) => {
  const owner_id = req.user.id;
  const result = await pool.query(
    `SELECT u.name, u.email, r.rating
     FROM users u
     JOIN ratings r ON u.id = r.user_id
     JOIN stores s ON s.id = r.store_id
     WHERE s.owner_id = $1`,
    [owner_id]
  );
  res.json(result.rows);
});

module.exports = router;

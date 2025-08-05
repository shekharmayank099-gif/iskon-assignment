const express = require('express');
const db = require('../database/connection');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const locations = await db('locations')
      .select('*')
      .orderBy('name', 'asc');

    res.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
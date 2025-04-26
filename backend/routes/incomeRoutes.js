const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
  addIncome,
  getIncomes,
  deleteIncome
} = require('../controllers/incomeController');

router.use(authenticate);

// POST /api/income       → add new
router.post('/', addIncome);

// GET  /api/income       → list all
router.get('/', getIncomes);

// DELETE /api/income/:id → delete one
router.delete('/:id', deleteIncome);

module.exports = router;

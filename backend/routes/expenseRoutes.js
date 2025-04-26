const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require('../controllers/expenseController');

router.use(authenticate);

// POST /api/expense       → add new
router.post('/', addExpense);

// GET  /api/expense       → list all
router.get('/', getExpenses);

// DELETE /api/expense/:id → delete one
router.delete('/:id', deleteExpense);

module.exports = router;

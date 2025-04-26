const Expense = require('../models/expense');

const addExpense = async (req, res) => {
  try {
    const { title, amount, date, icon } = req.body;
    const newExpense = new Expense({
      title,
      amount,
      date,
      icon,
      user: req.user.id,
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: 1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
};

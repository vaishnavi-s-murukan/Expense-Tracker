const Income = require('../models/Income');

// Add new income
exports.addIncome = async (req, res) => {
  try {
    const { title, amount, date, icon } = req.body;
    const income = new Income({
      userId: req.user.id,
      title,
      amount,
      date,
      icon
    });
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding income' });
  }
};

// Get all incomes for this user
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incomes' });
  }
};


// Delete an income by ID
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Income.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting income' });
  }
};

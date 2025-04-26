// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();

app.use(cors({
  origin: ["http://localhost:5173", "https://trackexpensetrack.netlify.app"],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected ✅");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  })
  .catch((err) => {
    console.error("DB connection error ❌", err);
  });

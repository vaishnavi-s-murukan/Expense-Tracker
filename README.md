Expense Tracker 💸

A full-stack Expense Tracker app built with the MERN Stack, allowing users to track incomes and expenses, visualize data through charts, and export records for easy management.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Chart.js, Axios

Backend: Node.js, Express.js, MongoDB, Mongoose, JWT

Other Libraries: React Router, ExcelJS, React Context API

📂 Project Structure
Backend (/backend)
/controllers     => Handle request logic (auth, income, expense)

/models          => Mongoose models (User, Income, Expense)

/routes          => API routes (authRoutes, incomeRoutes, expenseRoutes)

/middleware      => JWT authentication middleware

/utils           => Utility functions (Excel file generator)

server.js        => App entry point

Frontend (/frontend)

/components      => Reusable components (Sidebar, Navbar, Cards, Charts)

/pages           => Pages (Dashboard, Income, Expense)

/services        => API calls using Axios

/context         => Global context for auth and app state

/utils           => Helper functions (date formatting, etc.)

main.jsx         => Frontend entry point

App.jsx          => Route management


🧩 Main Features

*Authentication

Register and Login (JWT-based)

Protected routes with context

*Income and Expense Management

Add, view, and delete transactions

Transactions include amount, category, date, description

*Dashboard Overview

Summary cards for income, expense, and balance

Charts for the last 60 days' overview

*Data Visualization

Line chart for recent income

Doughnut chart for income/expense ratio

*Export Functionality

Export transactions as an .xlsx file

*Responsive UI

Mobile-friendly with collapsible sidebar

Smooth navigation experience

⚙️ How It Works

After registration/login, a JWT token is stored and used for authentication.

Income and Expense transactions are CRUD operations connected to MongoDB.

Charts are generated dynamically based on the last 60 days of data.

ExcelJS is used to export a user's transaction history.

Axios is used for frontend-backend communication.

🙌 Thanks for visiting! Happy Tracking!


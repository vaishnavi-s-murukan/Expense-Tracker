import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, CreditCard, HandCoins, TrendingUp, TrendingDown } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface IncomeItem {
  amount: number;
  date: string;
  title?: string;
  category?: string;
  type?: 'income';
  icon?: string;
}

interface ExpenseItem {
  amount: number;
  date: string;
  title?: string;
  category?: string;
  type?: 'expense';
  icon?: string;
}

const Dashboard = () => {
  const [income, setIncomeData] = useState<IncomeItem[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<(IncomeItem | ExpenseItem)[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [last30DaysExpense, setLast30DaysExpense] = useState<number[]>([]);
  const [last30Labels, setLast30Labels] = useState<string[]>([]);
  const [last60IncomeByCategory, setLast60IncomeByCategory] = useState<Record<string, number>>({});


  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeRes = await fetch('https://expense-tracker-p0nw.onrender.com/api/income', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const income = await incomeRes.json();
        setIncomeData(income);
        const totalIncome: number = income.reduce((acc: number, item: IncomeItem) => acc + item.amount, 0);
        setTotalIncome(totalIncome);

        const expenseRes = await fetch('https://expense-tracker-p0nw.onrender.com/api/expense', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // last 60 days income by category
        const today = new Date();
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(today.getDate() - 59);

        const incomeLast60 = income.filter((inc: IncomeItem) => {
          const incDate = new Date(inc.date);
          return incDate >= sixtyDaysAgo && incDate <= today;
        });

        // Group by category
        const grouped: Record<string, number> = {};
        incomeLast60.forEach((inc: IncomeItem) => {
          if (inc.title) {
            if (grouped[inc.title]) {
              grouped[inc.title] += inc.amount;
            } else {
              grouped[inc.title] = inc.amount;
            }
          }
        });

        setLast60IncomeByCategory(grouped);
        console.log("Last 60 Income By Category:", last60IncomeByCategory);

        const expense = await expenseRes.json();
        setExpenseData(expense);
        setExpenses(expense);
        const totalExpense: number = expense.reduce((acc: number, item: { amount: number }) => acc + item.amount, 0);
        setTotalExpense(totalExpense);

        const merged: (IncomeItem | ExpenseItem)[] = [
          ...income.map((i: IncomeItem) => ({ ...i, type: 'income' } as const)),
          ...expense.map((e: ExpenseItem) => ({ ...e, type: 'expense' } as const)),
        ];
        const sorted = merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
        setRecentTransactions(sorted);
        // last 30 days expenses grouping
        const labels: string[] = [];
        const dataVals: number[] = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          labels.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
          const sum: number = expense
            .filter((e: ExpenseItem) => e.date.slice(0, 10) === key)
            .reduce((acc: number, e: ExpenseItem) => acc + e.amount, 0);
          dataVals.push(sum);
        }
        setLast30Labels(labels);
        setLast30DaysExpense(dataVals);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, [token, last60IncomeByCategory]);

  const chartData = {
    labels: ['Total Income', 'Total Expenses', 'Balance'],
    datasets: [
      {
        data: [totalIncome, totalExpense, totalIncome - totalExpense],
        backgroundColor: ['#f97316', '#ef4444', '#6366f1'],
        borderWidth: 1,
      },
    ],
  };
  const barData = {
    labels: last30Labels,
    datasets: [
      {
        label: 'Last 30 Days Expenses',
        data: last30DaysExpense,
        backgroundColor: 'brown',
        borderRadius: 4,
      },
    ],
  };
  const doughnutData = {
    labels: Object.keys(last60IncomeByCategory),
    datasets: [
      {
        label: 'Income',
        data: Object.values(last60IncomeByCategory),
        backgroundColor: [
          '#6366f1', '#ef4444', '#f97316', '#a855f7',
          '#22c55e', '#3b82f6', '#eab308', '#14b8a6',
          '#8b5cf6', '#f59e0b', '#10b981', '#0ea5e9'
        ],
        cutout: '70%',
      },
    ],
  };



  return (
    <div className="w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <div className="bg-purple-600 text-white p-3 rounded-full">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-gray-500">Total Balance</h2>
            <p className="text-2xl font-bold text-gray-800">
              ₹{(totalIncome - totalExpense).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <div className="bg-orange-500 text-white p-3 rounded-full">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-gray-500">Total Income</h2>
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalIncome.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <div className="bg-red-500 text-white p-3 rounded-full">
            <HandCoins size={24} />
          </div>
          <div>
            <h2 className="text-gray-500">Total Expenses</h2>
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalExpense.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          {recentTransactions.length > 0 ? (
            <ul className="space-y-3">
              {recentTransactions.map((tx, i) => (
                <li key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-xl">
                    {tx.icon || "💰"}
                  </div>
                  <div>
                    <p className="capitalize font-medium">{tx.title || tx.category}</p>
                    <span className="text-sm text-gray-400">
                      {new Date(tx.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-base">
                      {tx.type === 'income' ? (
                        <TrendingUp className="text-green-600" />
                      ) : (
                        <TrendingDown className="text-red-600" />
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No transactions yet.</p>
          )}
        </div>

        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-lg shadow ">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <div className="flex items-center justify-center h-64 w-full">
            <Doughnut data={chartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Expense Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Expenses</h3>
            <Link
              to="/dashboard/expense"
              className="text-sm !text-black hover:text-gray-700 flex items-center gap-1"
            >
              See All <span>➡️</span>
            </Link>
          </div>

          {expenses.length > 0 ? (
            <ul className="space-y-3">
              {expenses.slice(0, 4).map((exp, i) => (
                <li key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-xl">
                      {exp.icon || "💸"}
                    </div>
                    <div>
                      <p className="capitalize font-medium">{exp.title || exp.category}</p>
                      <span className="text-sm text-gray-400">
                        {new Date(exp.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    -₹{exp.amount.toLocaleString('en-IN')}
                    <TrendingDown className="text-red-600" />
                  </span>

                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No expenses found.</p>
          )}
        </div>
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Last 30 Days Expenses</h3>
          <div className="h-64">
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { display: false }, grid: { display: false } }, y: { beginAtZero: true, grid: { display: false }, }, }, datasets: { bar: { barThickness: 10 } } }} />
          </div>
        </div>
      </div>
      {/* Income Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 mt-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Last 60 Days Income</h3>
          <div className="h-72 flex flex-col items-center justify-center relative">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                cutout: "70%", // Make inner circle bigger
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold">
                ₹{Object.values(last60IncomeByCategory).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>

          {/* Custom Legends with Points */}
          <div className="flex flex-wrap justify-center mt-4">
            {doughnutData.labels.map((label, index) => (
              <div key={index} className="flex items-center m-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }}
                ></span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Income</h3>
            <Link to="/dashboard/income" className="text-sm !text-black hover:text-gray-700 flex items-center gap-1">
              See All <span>➡️</span>
            </Link>
          </div>

          {income.length > 0 ? (
            <ul className="space-y-3">
              {income.slice(0, 5).map((item, i) => (
                <li key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-xl">
                      {item.icon || "💰"}
                    </div>
                    <div>
                      <p className="capitalize font-medium">{item.title || item.category}</p>
                      <span className="text-sm text-gray-400">
                        {new Date(item.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    +₹{item.amount.toLocaleString('en-IN')}
                    <TrendingUp className="text-green-600" />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No income records.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

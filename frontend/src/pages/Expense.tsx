import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingDown, Download, X } from 'lucide-react';
import EmojiPickerComponent from "../components/icons";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import * as XLSX from 'xlsx';

const Expense = () => {
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState<{ _id: string; title: string; amount: number; date: string; icon: string }[]>([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', date: '', icon: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('https://expense-tracker-p0nw.onrender.com/api/expense', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, [token]);

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.date || !newExpense.amount) return;

    try {
      const response = await fetch('https://expense-tracker-p0nw.onrender.com/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newExpense.title,
          date: newExpense.date,
          amount: parseFloat(newExpense.amount),
          icon: newExpense.icon,
        }),
      });

      if (response.ok) {
        const added = await response.json();
        setExpenses(prev => [...prev, added]); // Add new data to UI
        setNewExpense({ title: '', date: '', amount: '', icon: '' });
        setShowModal(false);
      } else {
        console.error('Error adding expense');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  const handleDelete = async (id: string) => {
    const res = await fetch(`https://expense-tracker-p0nw.onrender.com/api/expense/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setExpenses(prev => prev.filter(e => e._id !== id));
  };
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData = {
    labels: sortedExpenses.map(exp =>
      new Date(exp.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })
    ),    
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map(exp => exp.amount),
        borderColor: 'brown',
        backgroundColor: 'rgba(236, 143, 221, 0.2)',
        tension: 0.5,
        fill: true,
        pointBackgroundColor: 'brown',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderColor: 'brown',
        pointBorderWidth: 2,
      },
    ],    
  };

  const exportToExcel = () => {
      // 2. Map into simple objects
      const dataForSheet = expenses.map((item) => ({
        Title: item.title,
        Date: new Date(item.date).toLocaleDateString('en-GB'),
        Amount: item.amount,
      }));
  
      // 3. Create worksheet & workbook
      const ws = XLSX.utils.json_to_sheet(dataForSheet);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Income');
  
      // 4. Trigger download
      XLSX.writeFile(wb, 'expense_data.xlsx');
    };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expenses Overview</h1>
        <button onClick={() => setShowModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded shadow mb-8">
      <div className="relative w-full h-[300px] md:h-[300px]">
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                grid: {
                  display: false, // removes vertical lines
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: undefined,
                },
                min: 0,
                max: Math.max(...expenses.map(exp => exp.amount)) + 1000, // Adjust max value based on data
                grid: {
                  display: false, // removes horizontal lines
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
        </div>

      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Expenses</h2>
        <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
          <Download size={16} /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expenses.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
              {/* Left section: Icon + Title + Date */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {item.icon || "💰"} {/* shows emoji or fallback */}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              {/* Right section: Amount + Trend Icon + Trash */}
              <div className="flex items-center gap-3">
                <p className="text-red-600 font-bold flex items-center gap-1">
                  - ₹{item.amount}
                  <TrendingDown size={16} />
                </p>

                {/* Trash Button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <X />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Expenses</h2>

            {/* Icon Picker */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10">
                <EmojiPickerComponent
                  onSelect={(emoji: string) => setNewExpense({ ...newExpense, icon: emoji })}
                />
              </div>
              <span className="text-sm text-gray-500">Pick Icon</span>
            </div>

            {/* Income Source */}
            <label className="text-sm text-gray-600">Category</label>
            <input
              type="text"
              placeholder="Rent, Shopping, etc"
              value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              className="w-full mt-1 mb-4 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Amount */}
            <label className="text-sm text-gray-600">Amount</label>
            <input
              type="number"
              placeholder="₹0"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full mt-1 mb-4 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Date */}
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="w-full mt-1 mb-6 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Add Button */}
            <button
              onClick={handleAddExpense}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Add Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;

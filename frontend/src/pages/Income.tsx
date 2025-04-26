import  { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, X, Trash2, TrendingUp, Download } from 'lucide-react';
import EmojiPickerComponent from "../components/icons";
import * as XLSX from 'xlsx';


const Income = () => {
  const [showModal, setShowModal] = useState(false);
  const [incomeData, setIncomeData] = useState<{ title: string; date: string; amount: number; _id: string; icon: string }[]>([]);
  const [newIncome, setNewIncome] = useState({
    title: '',
    date: '',
    amount: '',
    icon: '',
  });

  const token = localStorage.getItem('token');

  // Fetch income data
  useEffect(() => {
    fetch('https://expense-tracker-p0nw.onrender.com/api/income', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log('Income fetched:', data);
        setIncomeData(data);
      })
      .catch(err => console.error('Failed to fetch income:', err));
  }, [token]);

  // Add new income to backend
  const handleAddIncome = async () => {
    if (!newIncome.title || !newIncome.date || !newIncome.amount) return;

    try {
      const response = await fetch('https://expense-tracker-p0nw.onrender.com/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newIncome.title,
          date: newIncome.date,
          amount: parseFloat(newIncome.amount),
          icon: newIncome.icon,
        }),
      });

      if (response.ok) {
        const added = await response.json();
        setIncomeData(prev => [...prev, added]); // Add new data to UI
        setNewIncome({ title: '', date: '', amount: '', icon: '' });
        setShowModal(false);
      } else {
        console.error('Error adding income');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle delete income
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://expense-tracker-p0nw.onrender.com/api/income/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIncomeData(prev => prev.filter(item => item._id !== id));
      } else {
        console.error('Failed to delete income');
      }
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const chartData = [...incomeData]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
      amount: item.amount,
    }));
  const exportToExcel = () => {
    // 2. Map into simple objects
    const dataForSheet = incomeData.map((item) => ({
      Title: item.title,
      Date: new Date(item.date).toLocaleDateString('en-GB'),
      Amount: item.amount,
    }));

    // 3. Create worksheet & workbook
    const ws = XLSX.utils.json_to_sheet(dataForSheet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Income');

    // 4. Trigger download
    XLSX.writeFile(wb, 'income_data.xlsx');
  };


  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Income Overview</h1>
        <button
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Add Income
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis
              domain={[0, 50000]} // sets min and max value
              tickFormatter={(value) => `${value.toLocaleString()}`} // adds ₹ and commas
            />

            <Tooltip />
            <Bar dataKey="amount" fill="brown" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income Sources */}
      <div className="space-y-4">
        {/* Header with Download button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Income Sources</h2>
          <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
          <Download size={16} /> Download
        </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incomeData.map((item, idx) => (
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
                <p className="text-green-600 font-bold flex items-center gap-1">
                  + ₹{item.amount}
                  <TrendingUp size={16} />
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

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Income</h2>

            {/* Icon Picker */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10">
                <EmojiPickerComponent
                  onSelect={(emoji: string) => setNewIncome({ ...newIncome, icon: emoji })}
                />
              </div>
              <span className="text-sm text-gray-500">Pick Icon</span>
            </div>

            {/* Income Source */}
            <label className="text-sm text-gray-600">Income Source</label>
            <input
              type="text"
              placeholder="Freelance, Salary, etc"
              value={newIncome.title}
              onChange={(e) => setNewIncome({ ...newIncome, title: e.target.value })}
              className="w-full mt-1 mb-4 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Amount */}
            <label className="text-sm text-gray-600">Amount</label>
            <input
              type="number"
              placeholder="₹0"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
              className="w-full mt-1 mb-4 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Date */}
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
              className="w-full mt-1 mb-6 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Add Button */}
            <button
              onClick={handleAddIncome}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Add Income
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;

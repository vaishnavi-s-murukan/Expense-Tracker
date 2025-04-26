import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, CreditCard, Wallet, LogOut, Menu } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userName, setUserName] = useState('User');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/getUser', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.username || data.name || 'User');
        }
      } catch (err) {
        console.error('User fetch failed', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const firstLetter = userName.charAt(0).toUpperCase();

  const navLinkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-200 ${location.pathname === path ? 'bg-red-200 text-black font-medium' : 'text-gray-700'
    }`;

  return (
    <div className={`h-screen ${isOpen ? 'w-64' : 'w-16'} bg-white shadow-md flex flex-col transition-all duration-300`}>
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-3 self-end text-gray-500 hover:text-black">
        <Menu size={20} />
      </button>

      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-2 mt-4">
        <div className="w-16 h-16 bg-red-900 text-white flex items-center justify-center rounded-full text-xl font-bold">
          {firstLetter}
        </div>
        {isOpen && <h2 className="text-md font-semibold text-gray-800">{userName}</h2>}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-8 space-y-2 px-2">
        <Link to="/dashboard" className={`${navLinkClass('/dashboard')} !text-black`}>
          <LayoutGrid size={20} />
          {isOpen && 'Dashboard'}
        </Link>
        <Link to="/dashboard/income" className={`${navLinkClass('/dashboard/income')} !text-black`}>
          <CreditCard size={20} />
          {isOpen && 'Income'}
        </Link>
        <Link to="/dashboard/expense" className={`${navLinkClass('/dashboard/expense')} !text-black`}>
          <Wallet size={20} />
          {isOpen && 'Expense'}
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-lg !text-black hover:bg-red-200 mt-10">
          <LogOut size={20} />
          {isOpen && 'Logout'}
        </button>
      </nav>

    </div>
  );
};

export default Sidebar;

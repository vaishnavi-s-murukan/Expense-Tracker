import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black-600 shadow-md px-6 py-3 flex items-center z-50">
      <div className="text-white text-xl font-bold">Expense Tracker</div>
      <ul className="flex space-x-6 ml-auto">
        <li>
          <Link to="/" className="text-white hover:text-yellow-300 transition-colors">Home</Link>
        </li>
        <li>
          <Link to="/signin" className="text-white hover:text-yellow-300 transition-colors">Sign In</Link>
        </li>
        <li>
          <Link to="/signup" className="text-white hover:text-yellow-300 transition-colors">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}


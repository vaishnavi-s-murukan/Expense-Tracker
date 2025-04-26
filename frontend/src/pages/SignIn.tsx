import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface LoginResponse {
  token: string;
  message?: string;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const res = await fetch('https://expense-tracker-p0nw.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error(err);
    }
  };

  return (
    <div
    className="h-screen w-screen bg-cover bg-center relative flex flex-col items-center justify-center text-black"
    style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
       {/* Navbar */}
            <div className="relative z-10">
              <Navbar />
            </div>

      {/* centered form container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-lg bg-transparent bg-opacity-20 rounded-xl p-8 w-full max-w-md shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Sign In</h2>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-4 p-3 rounded bg-white bg-opacity-50 placeholder-gray-700 text-gray-900 focus:outline"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full mb-6 p-3 rounded bg-white bg-opacity-50 placeholder-gray-700 text-gray-900 focus:outline"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded bg-green-600 hover:bg-green-700 text-black font-medium transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

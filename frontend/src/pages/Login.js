import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Use environment variable for backend API URL
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the deployed backend URL instead of localhost
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      const { token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Redirect to the admin page upon successful login
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

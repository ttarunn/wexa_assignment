import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerSuccess } from '../../redux/authSlice';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useNavigate();
  const user = useSelector(store => store.auth.user);
  const dispatch = useDispatch()

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username: email, email, password }),
      });
      const data = await res.json();
      if (res?.ok) {
        dispatch(registerSuccess(data))
        router('/dashboard');
      } else {
        
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(()=> {
    if(user?.token){
        router('/dashboard')
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-100 dark:bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Register a new account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                placeholder="Name"
                id="name"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                id="password"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <span role="img" aria-label="Hide password">🙈</span> // Replace with an eye icon of your choice
                ) : (
                  <span role="img" aria-label="Show password">👁️</span> // Replace with an eye icon of your choice
                )}
              </button>
            </div>
            <div className="mt-4 relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                id="confirmPassword"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <span role="img" aria-label="Hide password">🙈</span> 
                ) : (
                  <span role="img" aria-label="Show password">👁️</span>
                )}
              </button>
            </div>
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Register</button>
            </div>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-4 text-red-700 border border-red-300 rounded bg-red-100 dark:bg-red-800 dark:text-red-200">
            <strong>Error</strong>: {error}
          </div>
        )}
        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">Login</Link>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const user = useSelector(store => store.auth.user)
  const router = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to reset password.');
        return;
      }

      setMessage('Password successfully reset! You can now log in.');
      router('login')
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
    <div className="flex items-center h-[90vh] justify-center bg-gray-100 dark:bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 relative">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                id="newPassword"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Reset Password</button>
            </div>
          </div>
        </form>
        {message && (
          <div className="mt-4 p-4 text-green-700 border border-green-300 rounded bg-green-100 dark:bg-green-800 dark:text-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 text-red-700 border border-red-300 rounded bg-red-100 dark:bg-red-800 dark:text-red-200">
            <strong>Error</strong>: {error}
          </div>
        )}
      </div>
    </div>
  );
}

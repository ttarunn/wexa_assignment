import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFAToken, setTwoFAToken] = useState(''); // State for 2FA token
  const [error, setError] = useState('');
  const [is2FA, setIs2FA] = useState(false); // State to manage 2FA flow
  const [showPassword, setShowPassword] = useState(false);
  const router = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector(store => store.auth.user)


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(process.env.API_UR + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.msg === '2FA token required') {
          setIs2FA(true); 
          setError('');
          return;
        }
        setError(data.msg || 'Invalid email or password');
        return;
      }

      dispatch(loginSuccess(data));
      toast.success('Login successful!');
      router('/dashboard')

    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(process.env.API_UR + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, twoFAToken }), // Include the 2FA token
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Failed to authenticate with 2FA');
        return;
      }

      // Handle successful login
      console.log('Login successful! Redirecting to dashboard...');
      // Add redirection logic here (e.g., using React Router)

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
      <div className="px-8 py-6 mt-4 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Login to your account
        </h3>
        {!is2FA ? ( // Render the login form or 2FA based on state
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="text"
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
                  <span role="img" aria-label="Hide password">🙈</span>
                ) : (
                  <span role="img" aria-label="Show password">👁️</span> 
                )}
              </button>
              </div>
              <div className="flex items-baseline justify-between">
                <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
                {/* <Link to={'/forgot-password'} className="text-sm text-blue-600 hover:underline">Forgot password?</Link> */}
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit}>
            <div className="mt-4">
              <div>
                <label htmlFor="twoFAToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300">2FA Token</label>
                <input
                  type="text"
                  placeholder="Enter your 2FA token"
                  id="twoFAToken"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={twoFAToken}
                  onChange={(e) => setTwoFAToken(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Verify 2FA</button>
              </div>
            </div>
          </form>
        )}
        {error && (
          <div className="mt-4 p-4 text-red-700 border border-red-300 rounded bg-red-100 dark:bg-red-800 dark:text-red-200">
            <strong>Error</strong>: {error}
          </div>
        )}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">Register</Link>
        </div>
      </div>
    </div>
  );
}

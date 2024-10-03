import React from 'react';
import ThemeToggle from '../Theme/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import toast from 'react-hot-toast';
import { resetDashboard } from '../../redux/dashboardSlice';

const Header = () => {

    const dispatch = useDispatch()
    const user = useSelector(store => store.auth.user)
    const router = useNavigate()
    
    const handleLogout = () => {
        dispatch(logout())
        dispatch(resetDashboard())
        toast.success('Successfully logged out!');
        router('/login')
    };

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
      <Link to={'/login'}>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Wexa App</h1>
      </Link>
      <div className='flex gap-5'>
        {user && <>
        <Link to={'/dashboard'} className='px-4 py-2 hover:bg-blue-500 transition duration-200 rounded  hover:text-white text-gray-900 dark:text-gray-100'>Dashboard</Link>
        <Link to={'/profile' } className='px-4 py-2 hover:bg-blue-500 transition duration-200 rounded text-gray-900 dark:text-gray-100 hover:text-white'>Profile</Link>
        <button 
          onClick={handleLogout} 
          className="text-gray-900 dark:text-gray-100 hover:text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          Log Out
        </button>
        </>}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;

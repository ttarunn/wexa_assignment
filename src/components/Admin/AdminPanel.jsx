import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../../redux/adminSlice';
import axios from 'axios';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users');
      dispatch(setUsers(response.data));
    };
    
    fetchUsers();
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/authSlice';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useSelector((store) => store.auth.user);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dispatch = useDispatch()
  const router = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.API_UR + '/api/users/profile-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      dispatch(loginSuccess({...user, name: updatedUser.name, email:updatedUser?.email, }));
      setName(updatedUser.name)
      setEmail(updatedUser?.email)
      toast.success('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        
        const avatarUrl = URL.createObjectURL(file);
        setAvatar(avatarUrl);
        setSuccess('Avatar updated successfully');
        setError('');
      } catch {
        setError('An error occurred while uploading the avatar');
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 2000);
    if (!user) {
      router('/login');
    }
  }, [error, success]);

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 min-h-[90vh] dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="flex items-center mb-4 gap-5">
        <div className="w-24 h-24 overflow-hidden rounded-full border border-gray-300 dark:border-gray-600 relative">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
              {name && name[0]}
            </div>
          )}
        </div>
        <div>
          <input 
            type="file" 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="mt-2"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder='Your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder='Your email id'
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Update Profile
        </button>
      </form>
      {error && (
        <div className="p-4 mb-4 border-l-4 rounded-lg bg-red-100 text-red-800 border-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-4 border-l-4 rounded-lg bg-green-100 text-green-800 border-green-400">
          <strong>Success:</strong> {success}
        </div>
      )}
    </div>
  );
}

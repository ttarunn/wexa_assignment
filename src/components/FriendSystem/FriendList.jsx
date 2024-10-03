import React from 'react';
import { useSelector } from 'react-redux';

const FriendList = () => {
  const friends = useSelector((state) => state.friends.friendList);

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">Friends List</h2>
      <ul className="bg-white p-4 rounded shadow-md">
        {friends?.length > 0 ? (
          friends.map(friend => (
            <li key={friend.id} className="p-2 border-b">
              {friend.name}
            </li>
          ))
        ) : (
          <li className="p-2">No friends found.</li>
        )}
      </ul>
    </div>
  );
};

export default FriendList;

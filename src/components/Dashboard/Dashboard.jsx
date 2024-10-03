import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivities,
  setMetrics,
  setFriends,
} from "../../redux/dashboardSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { activities, metrics, friends } = useSelector(
    (state) => state.dashboard
  );
  const user = useSelector((store) => store.auth.user);
  const userToken = user?.token;
  const [userProfile, setUserProfile] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendRequest = async (_id) => {
    try {
      const response = await axios.post(
        process.env.API_UR + `/api/friends/send-request/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedFriends = friends.map((friend) =>
          friend._id === _id ? { ...friend, requestSent: true } : friend
        );
        dispatch(setFriends(updatedFriends));
        toast.success("Friend Request Sent!");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  async function getProfile() {
    try {
      const res = await fetch(process.env.API_UR + "/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setUserProfile(data);
      return (data?.sentfriendRequests)
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  function timeFormat(lastLogin) {
    const dateObject = new Date(lastLogin);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const seconds = String(dateObject.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    
    const fetchDashboardData = async () => {
      try {
        const requestIds = await getProfile();
        
        const usersResponse = await axios.get(
          process.env.API_UR + "/api/users/get-users",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const usersData = usersResponse.data;
        
        const friendsWithRequests = usersData.map((user) => ({
          ...user,
          requestSent:
          requestIds?.includes(user._id) || false,
        }));

        dispatch(setFriends(friendsWithRequests));

        const dummyActivities = [
          { id: 1, message: "You have a new friend request from Alice." },
          { id: 2, message: "Your post received 10 likes." },
          { id: 3, message: "Bob commented on your photo." },
        ];

        const dummyMetrics = {
          totalPosts: 50,
          totalFriends: 120,
          totalLikes: 250,
        };

        if (activities.length === 0) {
          dispatch(setActivities(dummyActivities));
        }
        if (metrics === null) {
          dispatch(setMetrics(dummyMetrics));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (friends?.length === 0) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
    
    if (!user) {
      router("/login");
    }
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Welcome {user?.name || "User"}
        </h2>
        <div>Last Login: {timeFormat(user?.lastLogin) || "N/A"}</div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Activity Feed</h3>
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md shadow"
            >
              {activity.message}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Friends List</h3>
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-200 dark:bg-gray-700 rounded-md shadow focus:outline-none"
        />
        <ul className="space-y-2">
          {filteredFriends.map((friend) => (
            <li
              key={friend._id}
              className="p-4 flex justify-between items-center bg-gray-200 dark:bg-gray-700 rounded-md shadow"
            >
              <span>{friend.name}</span>
              {friend.requestSent ? (
                <span className="text-green-500">Request Sent</span>
              ) : (
                <button
                  onClick={() => handleSendRequest(friend._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md"
                >
                  Send Friend Request
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-md mx-auto mt-8 p-4">
        <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Posts
            </h4>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {metrics.totalPosts}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Friends
            </h4>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {metrics.totalFriends}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Likes
            </h4>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {metrics.totalLikes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

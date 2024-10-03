// dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    activities: [],
    metrics: null,
    friends: [], // Add friends state
  },
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload;
    },
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    updateFriendRequest: (state, action) => {
      const { id } = action.payload;
      const friend = state.friends.find((friend) => friend.id === id);
      if (friend) {
        friend.requestSent = true;
      }
    },
    resetDashboard: (state, action) => {
        state.activities = [];
        state.metrics = null;
        state.friends = []
      },
  },
});

export const { setActivities, setMetrics, setFriends, updateFriendRequest, resetDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dashboardReducer from './dashboardSlice';
import profileReducer from './profileSlice';
import notificationsReducer from './notificationsSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    notifications: notificationsReducer,
    admin: adminReducer,
  },
});

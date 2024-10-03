import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    loginFailure(state, action) {
      state.error = action.payload;
    },
    registerSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    registerFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, loginFailure, registerSuccess, registerFailure } = authSlice.actions;
export default authSlice.reducer;

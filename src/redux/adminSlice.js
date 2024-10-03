import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload);
    },
    removeUser(state, action) {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, removeUser } = adminSlice.actions;
export default adminSlice.reducer;

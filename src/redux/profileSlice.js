import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {},
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.profile = action.payload;
      state.loading = false;
    },
    updateProfileFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
  },
});

export const { updateProfileStart, updateProfileSuccess, updateProfileFailure, setProfile } = profileSlice.actions;
export default profileSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const state = {
  userId: null,
  username: null,
  isAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      username: payload.username,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      isAuth: payload.isAuth,
    }),
    authSignOut: () => state,
  },
});

export const { updateUserProfile, authStateChange, authSignOut } =
  authSlice.actions;

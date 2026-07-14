import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Load user safely from localStorage
let userFromStorage = null;
try {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    userFromStorage = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Failed to parse user from localStorage:", error);
  localStorage.removeItem('user');
}

interface UserState {
  user: any;
}

const initialState: UserState = {
  user: userFromStorage,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export const selectUser = (state: any) => state.user.user;

export default userSlice.reducer;

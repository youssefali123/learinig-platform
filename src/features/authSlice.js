import { createSlice } from '@reduxjs/toolkit';
import { users } from '../data/users';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    register: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Thunk-like login action using demo data
export const loginUser = (email, password) => (dispatch) => {
  dispatch(loginStart());
  // Simulate API call
  setTimeout(() => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      dispatch(loginSuccess(user));
    } else {
      dispatch(loginFailure('Invalid email or password'));
    }
  }, 800);
};

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  register,
  updateProfile,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

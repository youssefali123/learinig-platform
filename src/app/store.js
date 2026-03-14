import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import coursesReducer from '../features/coursesSlice';
import quizReducer from '../features/quizSlice';
import uiReducer from '../features/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    quiz: quizReducer,
    ui: uiReducer,
  },
});

export default store;

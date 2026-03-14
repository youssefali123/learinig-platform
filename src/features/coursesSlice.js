import { createSlice } from '@reduxjs/toolkit';
import { courses as demoCourses } from '../data/courses';

const initialState = {
  courses: demoCourses,
  enrolledCourses: [1, 3, 5], // demo enrolled course IDs for student
  completedLessons: { 1: [1, 2, 3], 3: [1], 5: [] },
  searchQuery: '',
  selectedCategory: null,
  selectedLevel: null,
  sortBy: 'popular',
  loading: false,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
    },
    enrollCourse: (state, action) => {
      if (!state.enrolledCourses.includes(action.payload)) {
        state.enrolledCourses.push(action.payload);
        state.completedLessons[action.payload] = [];
      }
    },
    unenrollCourse: (state, action) => {
      state.enrolledCourses = state.enrolledCourses.filter((id) => id !== action.payload);
      delete state.completedLessons[action.payload];
    },
    completeLesson: (state, action) => {
      const { courseId, lessonId } = action.payload;
      if (!state.completedLessons[courseId]) {
        state.completedLessons[courseId] = [];
      }
      if (!state.completedLessons[courseId].includes(lessonId)) {
        state.completedLessons[courseId].push(lessonId);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  completeLesson,
  setSearchQuery,
  setSelectedCategory,
  setSelectedLevel,
  setSortBy,
  setLoading,
} = coursesSlice.actions;

export default coursesSlice.reducer;

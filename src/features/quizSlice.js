import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 0,
  isSubmitted: false,
  score: null,
  quizHistory: [],
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action) => {
      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.timeRemaining = action.payload.timeLimit * 60;
      state.isSubmitted = false;
      state.score = null;
    },
    setAnswer: (state, action) => {
      const { questionId, answerIndex } = action.payload;
      state.answers[questionId] = answerIndex;
    },
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    goToQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    submitQuiz: (state) => {
      if (!state.currentQuiz) return;
      
      let correctCount = 0;
      let totalPoints = 0;
      let earnedPoints = 0;

      state.currentQuiz.questions.forEach((q) => {
        totalPoints += q.points;
        if (state.answers[q.id] === q.correctAnswer) {
          correctCount += 1;
          earnedPoints += q.points;
        }
      });

      state.score = {
        correct: correctCount,
        total: state.currentQuiz.questions.length,
        earnedPoints,
        totalPoints,
        percentage: Math.round((earnedPoints / totalPoints) * 100),
        passed: Math.round((earnedPoints / totalPoints) * 100) >= state.currentQuiz.passingScore,
      };
      state.isSubmitted = true;

      state.quizHistory.push({
        quizId: state.currentQuiz.id,
        score: state.score,
        answers: { ...state.answers },
        completedAt: new Date().toISOString(),
      });
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.timeRemaining = 0;
      state.isSubmitted = false;
      state.score = null;
    },
  },
});

export const {
  startQuiz,
  setAnswer,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  decrementTimer,
  submitQuiz,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;

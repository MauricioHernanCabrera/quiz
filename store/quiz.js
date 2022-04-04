import { createSlice } from "@reduxjs/toolkit";
import { QUESTIONS_AMOUNT, QUIZ } from "../consts";

export const quizSlice = createSlice({
  name: "quiz",

  initialState: {
    answers: [],
    currentAnswer: 0,
    interval: null,
    lifetimeSeconds: null,
  },

  reducers: {
    remake: (state) => {
      state.answers = [];
      state.currentAnswer = 0;
      state.interval = null;
      state.lifetimeSeconds = null;
    },

    initCurrentTime: (state, action) => {
      state.lifetimeSeconds =
        QUIZ.questions[state.currentAnswer].lifetimeSeconds;
    },

    subtractCurrentTime: (state, action) => {
      state.lifetimeSeconds -= 1;

      if (state.lifetimeSeconds >= 0) {
        return;
      }

      state.answers.push({
        optionIndex: 999999,
        questionIndex: state.currentAnswer,
      });

      if (state.currentAnswer + 1 < QUESTIONS_AMOUNT) {
        state.currentAnswer = state.currentAnswer + 1;

        state.lifetimeSeconds =
          QUIZ.questions[state.currentAnswer].lifetimeSeconds;

        return;
      }

      clearInterval(state.interval);
      state.interval = null;
      state.lifetimeSeconds = 999999;
    },

    setInterlude: (state, action) => {
      state.interval = action.payload;
    },

    clearCountDown: (state) => {
      if (!state.interval) {
        return;
      }

      clearInterval(state.interval);
      state.lifetimeSeconds = null;
    },

    addAnswer: (state, action) => {
      state.answers.push({
        optionIndex: action.payload,
        questionIndex: state.currentAnswer,
      });

      if (state.currentAnswer + 1 < QUESTIONS_AMOUNT) {
        state.currentAnswer = state.currentAnswer + 1;
        state.lifetimeSeconds =
          QUIZ.questions[state.currentAnswer].lifetimeSeconds;
        return;
      }

      clearInterval(state.interval);
      state.interval = null;
      state.lifetimeSeconds = 999999;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addAnswer,
  clearCountDown,
  initCurrentTime,
  subtractCurrentTime,
  setInterlude,
  remake,
} = quizSlice.actions;

export const startCountDown = () => (dispatch) => {
  dispatch(initCurrentTime());

  const interval = setInterval(() => {
    dispatch(subtractCurrentTime());
  }, 1000);

  dispatch(setInterlude(interval));
};

export const useSelectResume = (state) => {
  const answers = state.quiz.answers;

  return answers.map(({ optionIndex, questionIndex }) => ({
    optionIndex,
    questionIndex,
    question: QUIZ.questions[questionIndex],
  }));
};

export default quizSlice.reducer;

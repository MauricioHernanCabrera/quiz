import { configureStore } from "@reduxjs/toolkit";

import quizReducer from "./quiz";
import contractReducer from "./contract";

export default configureStore({
  reducer: {
    quiz: quizReducer,
    contract: contractReducer,
  },
});

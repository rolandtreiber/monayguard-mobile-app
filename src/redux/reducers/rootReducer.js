import { combineReducers } from "redux"
import userReducer from './userReducer'
import dialogReducer from './dialogReducer'
import selectDataReducer from "./selectDataReducer";

const rootReducer = combineReducers({
  user: userReducer,
  dialog: dialogReducer,
  select: selectDataReducer
});

export default rootReducer;

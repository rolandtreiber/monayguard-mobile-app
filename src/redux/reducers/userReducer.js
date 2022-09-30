import {
  SET_TOKEN,
  CLEAR,
  SET_USER_DATA
} from "../actions/userActions";

const initState = {
  token: null,
  userData: null
}

const sessionReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    case CLEAR:
      return {
        token: null,
        userData: null
      }
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      }
    default:
      return state
  }
}

export default sessionReducer

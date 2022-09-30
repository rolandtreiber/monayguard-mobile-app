import {
  SET_TEMPLATES,
  SET_CATEGORIES,
  SET_TAGS,
  SET_IMPORTANCE_LEVELS
} from "../actions/selectDataActions";

const initState = {
  categories: [],
  tags: [],
  templates: [],
  importanceLevels: []
}

const selectDataReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_TEMPLATES:
      return {
        ...state,
        templates: [...action.payload]
      }
    case SET_CATEGORIES:
      return {
        ...state,
        categories: [...action.payload]
      }
    case SET_TAGS:
      return {
        ...state,
        tags: [...action.payload]
      }
    case SET_IMPORTANCE_LEVELS:
      return {
        ...state,
        importanceLevels: [...action.payload]
      }
    default:
      return state
  }
}

export default selectDataReducer

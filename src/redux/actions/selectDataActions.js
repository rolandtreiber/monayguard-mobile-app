export const SET_CATEGORIES = "SET_CATEGORIES";
export const SET_TAGS = "SET_TAGS";
export const SET_TEMPLATES = "SET_TEMPLATES";
export const SET_IMPORTANCE_LEVELS = "SET_IMPORTANCE_LEVELS";

export const setCategories = (data) => {
  return {
    type: SET_CATEGORIES,
    payload: data
  }
}

export const setTags = (data) => {
  return {
    type: SET_TAGS,
    payload: data
  }
}

export const setTemplates = (data) => {
  return {
    type: SET_TEMPLATES,
    payload: data
  }
}

export const setImportanceLevels = (data) => {
  return {
    type: SET_IMPORTANCE_LEVELS,
    payload: data
  }
}

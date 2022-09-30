export const SET_TOKEN = "SET_TOKEN";
export const CLEAR = "CLEAR";
export const SET_USER_DATA = "SET_USER_DATA";

export const setToken = (token) => {
  return {
    type: SET_TOKEN,
    payload: token
  }
}

export const setUserData = (data) => {
  return {
    type: SET_USER_DATA,
    payload: data
  }
}

export const clear = () => {
  return {
    type: CLEAR,
  }
}

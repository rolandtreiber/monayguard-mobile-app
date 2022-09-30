export const SHOW = "SHOW";
export const HIDE = "HIDE";
export const HIDE_ALL = "HIDE_ALL";

export const showModal = (name) => {
  return {
    type: SHOW,
    payload: name
  }
}

export const hideModal = (name) => {
  return {
    type: HIDE,
    payload: name
  }
}

export const closeModals = () => {
  return {
    type: HIDE_ALL,
  }
}

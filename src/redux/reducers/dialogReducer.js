import {
  SHOW,
  HIDE,
  HIDE_ALL
} from "../actions/dialogActions";

const initState = {
  dialogVisibilityData: {
    login: false,
    signup: false,
    manageAccount: false,
    updatePassword: false,
    manageCategory: false,
    manageTag: false,
    manageTransaction: false,
    manageImportanceLevel: false,
    manageTemplate: false,
    manageRecurringTransaction: false,
    manageGuard: false,
    manageSavingGoal: false,
    transactionAdvancedSearch: false,
    transactionFromTemplate: false
  }
}

const dialogReducer = (state = initState, action) => {
  const copy = {...state.dialogVisibilityData}
  switch (action.type) {
    case SHOW:
      copy[action.payload] = true
      return {
        ...state,
        dialogVisibilityData: {...copy}
      }
    case HIDE:
      copy[action.payload] = false
      return {
        ...state,
        dialogVisibilityData: {...copy}
      }
    case HIDE_ALL:
      return {
        ...state,
        dialogVisibilityData: {...initState.dialogVisibilityData}
      }
    default:
      return state
  }
}

export default dialogReducer

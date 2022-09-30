import {createStore, applyMiddleware} from "redux"
import {persistStore, persistReducer} from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import rootReducer from "./src/redux/reducers/rootReducer"
import thunk from "redux-thunk"

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["modalData", "modalVisibilityData", "dialogVisibilityData"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer, applyMiddleware(thunk))
  let persistor = persistStore(store)
  return {store, persistor}
}

import React, {createContext} from "react"
import axios from "axios"
import api from "../config/app-config.json"
import {useSelector, useDispatch} from "react-redux"
import {clear} from "../redux/actions/userActions";

const APIContext = createContext([{}, () => {}])

const APIProvider = ({children}) => {
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()

  // ApiHelper
  const createAxios = () => {

    const standardConfig = {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        Accept: "application/json",
        Origin: "app",
      },
    }

    let axiosAPI = axios.create(standardConfig)

    axiosAPI.interceptors.response.use(
      (response) => response,
      (error) => {
        const {response} = error
        if (response.status === 401) {
          dispatch(clear())
        }

        throw error
      },
    )

    return axiosAPI
  }

  const get = async (url, params = null, headers = {}) => {
    let config = {headers: headers}

    const urlParams = new URLSearchParams(params).toString()
    return await createAxios().get(url + "?" + urlParams, config)
  }

  const post = async (url, params = {}, headers = {}) => {
    let config = {headers: headers}
    return await createAxios().post(url, params, config)
  }

  const put = async (url, params = {}, headers = {}) => {
    let config = {headers: headers}

    params["_method"] = "put"
    return await createAxios().put(url, params, config)
  }

  const patch = async (url, params = {}, headers = {}) => {
    let config = {headers: headers}

    params["_method"] = "patch"
    return await createAxios().post(url, params, config)
  }

  const del = async (url, headers = {}) => {
    let config = {headers: headers}

    return await createAxios().delete(url, config)
  }

  const makeHeaders = (extraHeaders = null) => {
    let headers = {
    }
    // If a token is available, include it
    if (token) {
      headers["Authorization"] = "Bearer " + token
    }

    if (extraHeaders) {
      for (const [key, value] of Object.entries(extraHeaders)) {
        headers[key] = value
      }
    }

    return headers
  }

  const coreApiUrl = api.api_url

  const moneyGuardApiContext = React.useMemo(
    () => ({
      // Auth
      callLogin: async (params) =>
        post(coreApiUrl + "/auth/login", params, makeHeaders()),
      register: async (params) =>
        post(coreApiUrl + "/auth/signup", params, makeHeaders()),
      sendPasswordResetEmail: async (params) =>
        post(coreApiUrl + "/send-reset-password-email", params, makeHeaders()),
      getAccount: async () =>
        await get(coreApiUrl + "/account", {}, makeHeaders()),
      updateAccount: async (params) =>
        await put(coreApiUrl + "/account", params, makeHeaders()),

      getDashboard: async (params) => await post(coreApiUrl + "/account/dashboard", params, makeHeaders()),

      getCategoriesList: async (type, search) =>  await get(coreApiUrl + "/categories/select", {type, search}, makeHeaders()),
      getCategories: async (params) => await get(coreApiUrl + "/categories", params, makeHeaders()),
      getCategory: async (id) => await get(coreApiUrl + "/categories/"+id, {}, makeHeaders()),
      createCategory: async (params) => await post(coreApiUrl + "/categories", params, makeHeaders()),
      updateCategory: async (id, params) => await put(coreApiUrl + "/categories/"+id, params, makeHeaders()),
      deleteCategory: async (id) => await del(coreApiUrl + "/categories/"+id, makeHeaders()),

      getTagList: async (type, search) => await get(coreApiUrl + "/tags/select", {type, search}, makeHeaders()),
      getTags: async (params) => await get(coreApiUrl + "/tags", params, makeHeaders()),
      getTag: async (id) => await get(coreApiUrl + "/tags/"+id, {}, makeHeaders()),
      createTag: async (params) => await post(coreApiUrl + "/tags", params, makeHeaders()),
      updateTag: async (id, params) => await put(coreApiUrl + "/tags/"+id, params, makeHeaders()),
      deleteTag: async (id) => await del(coreApiUrl + "/tags/"+id, makeHeaders()),

      getImportanceLevelsList: async () => await get(coreApiUrl + "/importance-levels/select", {}, makeHeaders()),
      getImportanceLevels: async (params) => await get(coreApiUrl + "/importance-levels", params, makeHeaders()),
      getImportanceLevel: async (id) => await get(coreApiUrl + "/importance-levels/"+id, {}, makeHeaders()),
      createImportanceLevel: async (params) => await post(coreApiUrl + "/importance-levels", params, makeHeaders()),
      updateImportanceLevel: async (id, params) => await put(coreApiUrl + "/importance-levels/"+id, params, makeHeaders()),
      deleteImportanceLevel: async (id) => await del(coreApiUrl + "/importance-levels/"+id, makeHeaders()),

      getTemplatesList: async () => await get(coreApiUrl + "/templates/select", {}, makeHeaders()),
      getTemplates: async (params) => await get(coreApiUrl + "/templates", params, makeHeaders()),
      getTemplate: async (id) => await get(coreApiUrl + "/templates/"+id, {}, makeHeaders()),
      createTemplate: async (params) => await post(coreApiUrl + "/templates", params, makeHeaders()),
      updateTemplate: async (id, params) => await put(coreApiUrl + "/templates/"+id, params, makeHeaders()),
      deleteTemplate: async (id) => await del(coreApiUrl + "/templates/"+id, makeHeaders()),

      getTransactions: async (params) => await post(coreApiUrl + "/transactions/list", params, makeHeaders()),
      getTransaction: async (id) => await get(coreApiUrl + "/transactions/"+id, {}, makeHeaders()),
      createTransaction: async (params) => await post(coreApiUrl + "/transactions", params, makeHeaders()),
      updateTransaction: async (id, params) => await put(coreApiUrl + "/transactions/"+id, params, makeHeaders()),
      deleteTransaction: async (id) => await del(coreApiUrl + "/transactions/"+id, makeHeaders()),

      getRecurringTransactions: async (params) => await get(coreApiUrl + "/recurring-transactions", params, makeHeaders()),
      getRecurringTransaction: async (id) => await get(coreApiUrl + "/recurring-transactions/"+id, {}, makeHeaders()),
      createRecurringTransaction: async (params) => await post(coreApiUrl + "/recurring-transactions", params, makeHeaders()),
      updateRecurringTransaction: async (id, params) => await put(coreApiUrl + "/recurring-transactions/"+id, params, makeHeaders()),
      deleteRecurringTransaction: async (id) => await del(coreApiUrl + "/recurring-transactions/"+id, makeHeaders()),

      getGuards: async (params) => await get(coreApiUrl + "/guards", params, makeHeaders()),
      getGuard: async (id) => await get(coreApiUrl + "/guards/"+id, {}, makeHeaders()),
      createGuard: async (params) => await post(coreApiUrl + "/guards", params, makeHeaders()),
      updateGuard: async (id, params) => await put(coreApiUrl + "/guards/"+id, params, makeHeaders()),
      deleteGuard: async (id) => await del(coreApiUrl + "/guards/"+id, makeHeaders()),

      getSavingGoals: async (params) => await get(coreApiUrl + "/saving-goals", params, makeHeaders()),
      getSavingGoal: async (id) => await get(coreApiUrl + "/saving-goals/"+id, {}, makeHeaders()),
      createSavingGoal: async (params) => await post(coreApiUrl + "/saving-goals", params, makeHeaders()),
      updateSavingGoal: async (id, params) => await put(coreApiUrl + "/saving-goals/"+id, params, makeHeaders()),
      deleteSavingGoal: async (id) => await del(coreApiUrl + "/saving-goals/"+id, makeHeaders()),
    }),
    [token],
  )

  return (
    <APIContext.Provider value={moneyGuardApiContext}>
      {children}
    </APIContext.Provider>
  )
}

export {APIContext, APIProvider}

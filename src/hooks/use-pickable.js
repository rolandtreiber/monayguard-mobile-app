import React, {useContext, useMemo} from "react"
import {APIContext} from "../context/api-context";
import {useDispatch, useSelector} from "react-redux";
import {setCategories, setTags, setImportanceLevels} from "../redux/actions/selectDataActions";

const usePickable = () => {
  const {getCategoriesList, getTagList, getImportanceLevelsList} = useContext(APIContext)
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)

  const fetchCategories = async (type, search = '') => {
    getCategoriesList(type, search).then(response => {
      if (response.status === 200) {
        const {data} = response
        data && dispatch(setCategories(data))
      }
    }).catch(e => console.log("Error when loading categories: "+e.message))
  }

  const fetchTags = async (type, search = '') => {
    getTagList(type, search).then(response => {
      if (response.status === 200) {
        const {data} = response
        data && dispatch(setTags(data))
      }
    }).catch(e => console.log("Error when loading tags: "+e.message))
  }

  const fetchImportanceLevels = async () => {
    getImportanceLevelsList().then(response => {
      if (response.status === 200) {
        const {data} = response
        data && dispatch(setImportanceLevels(data))
      }
    }).catch(e => console.log("Error when loading importance levels: "+e.message))
  }

  return useMemo(
    () => ({
      loadCategories: fetchCategories,
      loadTags: fetchTags,
      loadImportanceLevels: fetchImportanceLevels,
    }),
    [token],
  )
}

export default usePickable

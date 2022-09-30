import React, {useContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {APIContext} from "../context/api-context";
import {setUserData} from "../redux/actions/userActions";
import {ActivityIndicator} from "react-native-paper";
import WelcomeNotLoggedIn from "./partials/welcome-not-logged-in";
import DrawerWrapper from "./layout/drawer-wrapper";
import {Container} from "../components/shared-styled-components";

const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const userData = useSelector((state) => state.user.userData)
  const [isLoading, setIsLoading] = useState(true)
  const {getAccount} = useContext(APIContext)

  const fetchAccountDetails = async () => {
    getAccount().then(response => {
      if (response && response.status === 200 && response.data) {
        dispatch(setUserData(response.data))
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchAccountDetails().catch(e => console.log(e.message))
  }, [token])

  return (
    <>
      {isLoading ? (
        <Container><ActivityIndicator/></Container>
      ) : (
        <>
          {token && userData ? (<DrawerWrapper/>) : <WelcomeNotLoggedIn/>}
        </>
      )}
    </>
  );
}

export default MainScreen

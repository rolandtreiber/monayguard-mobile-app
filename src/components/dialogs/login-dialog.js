import React, {useContext, useState} from "react";
import {
  Button, Paragraph, Dialog, Portal,
  TextInput as BaseTextInput, HelperText,
} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {showModal, hideModal} from "../../redux/actions/dialogActions";
import {ScrollView, TouchableOpacity} from "react-native";
import {APIContext} from "../../context/api-context";
import styled from "styled-components/native";
import {setToken, setUserData} from "../../redux/actions/userActions";
import Stack from "../stack";
import useKeyboardState from "../../hooks/use-keyboard-state";
import useValidation from "../../hooks/use-validation";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const LoginDialog = () => {
  const dispatch = useDispatch()
  const loginVisible = useSelector((state) => state.dialog.dialogVisibilityData.login)
  const {callLogin} = useContext(APIContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const {dialogStyles} = useKeyboardState()
  const {validate, validationResult} = useValidation({
    email: ['required'],
    password: ['required']
  })

  const close = () => {
    clear()
    dispatch(hideModal('login'))
  }

  const openSignup = () => {
    dispatch(hideModal('login'))
    dispatch(showModal('signup'))
  }

  const login = async () => {
    if (!validate({
      email, password
    })) {
      return
    }

    callLogin({
      email: email,
      password: password
    }).then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && data.jwt !== undefined) {
          dispatch(setToken(data.jwt))
          dispatch(setUserData({
            username: data.username,
            email: data.email
          }))
          close()
        }
      }
    }).catch(e => {
      const {response} = e
      if (response && response.status === 401) {
        setError("Email or password incorrect")
      }
    })
  }

  const clear = () => {
    setEmail('')
    setPassword('')
    setError('')
  }

  return (
    <Portal>
      <Dialog style={dialogStyles} visible={loginVisible} onDismiss={close}>
        <Dialog.Title>
          Sign In
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingVertical: 14}}>
          <Stack spacing={2}>
            <TextInput error={validationResult.email} autoCapitalize='none' onChangeText={(v) => setEmail(v)} value={email} label="Email" mode="flat"/>
            {validationResult.email && <HelperText type="error" visible={validationResult.email}>
              {validationResult.email}
            </HelperText>}
          </Stack>
          <Stack spacing={2}>
            <TextInput error={validationResult.password} onChangeText={(v) => setPassword(v)} value={password} label="Password" mode="flat"
                       secureTextEntry={true}/>
            {validationResult.password && <HelperText type="error" visible={validationResult.password}>
              {validationResult.password}
            </HelperText>}
          </Stack>
          <Paragraph variant={"body2"}>Don't have an account?</Paragraph>
          <TouchableOpacity onPress={openSignup}>
            <Paragraph variant={"body2"}>Sign Up!</Paragraph>
          </TouchableOpacity>
          {error && <ErrorMessage variant={"body2"}>{error}</ErrorMessage>}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button
            compact
            variant="text"
            onPress={close}
          >
            Cancel
          </Button>

          <Button
            compact
            variant="text"
            onPress={login}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default LoginDialog

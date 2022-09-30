import React, {useContext, useState} from "react";
import {
  Button,
  Dialog,
  TextInput as BaseTextInput,
  Paragraph,
  Portal, HelperText
} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {showModal, hideModal} from "../../redux/actions/dialogActions";
import {ScrollView, TouchableOpacity} from "react-native";
import Stack from "../stack";
import styled from "styled-components/native";
import useKeyboardState from "../../hooks/use-keyboard-state";
import {APIContext} from "../../context/api-context";
import {Row} from "../shared-styled-components";
import {BarPasswordStrengthDisplay} from "react-native-password-strength-meter";
import useValidation from "../../hooks/use-validation";

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const SignupDialog = () => {
  const dispatch = useDispatch()
  const signupVisible = useSelector((state) => state.dialog.dialogVisibilityData.signup)
  const {dialogStyles} = useKeyboardState()
  const {register} = useContext(APIContext)
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const {validate, validationResult} = useValidation({
    first_name: ['required'],
    last_name: ['required'],
    email: ['required', 'email'],
    password: ['required']
  })

  const close = () => {
    dispatch(hideModal('signup'))
  }

  const openLogin = () => {
    dispatch(hideModal('signup'))
    dispatch(showModal('login'))
  }

  const doRegister = async () => {
    register({
      prefix: ' ',
      first_name: firstName,
      last_name: lastName,
      email,
      password
    }).catch(e => {
      console.log(e.message)
      console.log(e.response.data)
    }).finally(() => {
      close()
    })
  }

  const submit = () => {
    if (!validate({
      first_name: firstName,
      last_name: lastName,
      email,
      password
    }) || password !== passwordConfirm) {
      return
    }
    doRegister().catch(e => {
      console.log(e.message)
    })
  }

  return (
    <Portal>
      <Dialog style={dialogStyles} visible={signupVisible} onDismiss={close}>
        <Dialog.Title>Sign Up</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingVertical: 14}}>
            <Stack spacing={2}>
              <TextInput error={validationResult.first_name}  onChangeText={(v) => setFirstName(v)} value={firstName} label="First Name" mode="flat"/>
              {validationResult.first_name && <HelperText type="error" visible={validationResult.first_name}>
                {validationResult.first_name}
              </HelperText>}
            </Stack>
            <Stack spacing={2}>
              <TextInput error={validationResult.last_name}  onChangeText={(v) => setLastName(v)} value={lastName} label="Last Name" mode="flat"/>
              {validationResult.last_name && <HelperText type="error" visible={validationResult.first_name}>
                {validationResult.last_name}
              </HelperText>}
            </Stack>
            <Stack spacing={2}>
              <TextInput error={validationResult.email}  autoCapitalize='none' onChangeText={(v) => setEmail(v)} value={email} label="Email"
                         mode="flat"/>
              {validationResult.email && <HelperText type="error" visible={validationResult.first_name}>
                {validationResult.email}
              </HelperText>}
            </Stack>
            <Stack spacing={2}>
              <TextInput error={validationResult.password}  onChangeText={(v) => setPassword(v)} value={password} label="Password" mode="flat"
                         secureTextEntry={true}/>
              {validationResult.password && <HelperText type="error" visible={validationResult.first_name}>
                {validationResult.password}
              </HelperText>}
              <Row style={{justifyContent: "center"}}>
                <BarPasswordStrengthDisplay
                  width={150}
                  barContainerStyle={{marginBottom: 15}}
                  password={password}
                />
              </Row>
            </Stack>
            <Stack spacing={2}>
              <TextInput autoCapitalize='none' onChangeText={(v) => setPasswordConfirm(v)} value={passwordConfirm}
                         label="Password Confirm" mode="flat"/>
              {password !== passwordConfirm && <HelperText type="error" visible={password !== passwordConfirm}>
                The password and password confirm fields need to match
              </HelperText>}
            </Stack>
            <Paragraph variant={"body2"}>Already have an account?</Paragraph>
            <TouchableOpacity onPress={openLogin}>
              <Paragraph variant={"body2"}>Sign In!</Paragraph>
            </TouchableOpacity>
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
            onPress={submit}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default SignupDialog

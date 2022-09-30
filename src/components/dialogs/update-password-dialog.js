import React, {useContext, useEffect, useState} from "react";
import {
  Button, Paragraph, Dialog, Portal,
  TextInput as BaseTextInput, HelperText,
} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {hideModal} from "../../redux/actions/dialogActions";
import {APIContext} from "../../context/api-context";
import styled from "styled-components/native";
import Stack from "../stack";
import useKeyboardState from "../../hooks/use-keyboard-state";
import {BarPasswordStrengthDisplay} from "react-native-password-strength-meter";
import {Row} from "../shared-styled-components";
import useValidation from "../../hooks/use-validation";
import {VALIDATOR_STATE_ON} from "../../utils/utils";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const UpdatePasswordDialog = ({id, updated}) => {
  const userData = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.updatePassword)
  const [error, setError] = useState('')
  const {updateAccount} = useContext(APIContext)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const {dialogStyles} = useKeyboardState()
  const {validate, validationResult, validatorState, pauseValidator} = useValidation({
    password: ['required']
  })

  useEffect(() => {
    id && getCategory(id).then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && response.status) {
          setPassword(data.name)
        }
      }
    }).catch(e => {
      console.log(e.message)
    })
  }, [id])

  const close = () => {
    clear()
    dispatch(hideModal('updatePassword'))
  }

  const submit = async () => {
    if (!validate({
      password
    }) || password !== passwordConfirm) {
      return
    }

      updateAccount({
        first_name: userData.first_name,
        last_name: userData.last_name,
        password
      }).then(response => {
        if (response && response.status === 200) {
            updated()
            close()
        }
      }).catch(e => {
        const {response} = e
        if (response) {
          setError("Something went wrong.")
        }
      })
  }

  const clear = () => {
    setPassword('')
    setPasswordConfirm('')
  }

  return (
    <Portal>
      <Dialog style={dialogStyles} visible={visible} onDismiss={close}>
        <Dialog.Title>
          Update Password
        </Dialog.Title>
        <Dialog.Content>
          <Stack spacing={2}>
            <TextInput error={validationResult.password} autoCapitalize='none' onChangeText={(v) => setPassword(v)} value={password} label="Password" mode="flat"/>
            {validationResult.password && <HelperText type="error" visible={validationResult.password}>
              {validationResult.password}
            </HelperText>}
            <Row style={{justifyContent: "center"}}>
              <BarPasswordStrengthDisplay
                width={150}
                barContainerStyle={{marginBottom: 15}}
                password={password}
              />
            </Row>
            <TextInput error={password !== passwordConfirm && validatorState === VALIDATOR_STATE_ON} autoCapitalize='none' onChangeText={(v) => setPasswordConfirm(v)} value={passwordConfirm} label="Password Confirm" mode="flat"/>
            {password !== passwordConfirm && <HelperText type="error" visible={password !== passwordConfirm}>
              The password and password confirm fields need to match
            </HelperText>}
          </Stack>
          {error && <ErrorMessage variant={"body2"}>{error}</ErrorMessage>}

        </Dialog.Content>
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
            onPress={() => submit()}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default UpdatePasswordDialog

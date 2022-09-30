import React, {useContext, useEffect, useState} from "react";
import {
  Button,
  Dialog,
  TextInput as BaseTextInput,
  Paragraph,
  Portal, RadioButton, HelperText
} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {showModal, hideModal} from "../../redux/actions/dialogActions";
import {ScrollView, TouchableOpacity} from "react-native";
import Stack from "../stack";
import styled from "styled-components/native";
import useKeyboardState from "../../hooks/use-keyboard-state";
import {APIContext} from "../../context/api-context";
import {RadioLabel, Row} from "../shared-styled-components";
import useValidation from "../../hooks/use-validation";

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const UpdateProfileDialog = ({profileData, setProfileData, updated}) => {
  const dispatch = useDispatch()
  const signupVisible = useSelector((state) => state.dialog.dialogVisibilityData.manageAccount)
  const {dialogStyles} = useKeyboardState()
  const {updateAccount} = useContext(APIContext)
  const [firstName, setFirstName] = useState(profileData.first_name)
  const [lastName, setLastName] = useState(profileData.last_name)
  const [currencySymbol, setCurrencySymbol] = useState(profileData.currency_symbol)
  const [currencyPlacement, setCurrencyPlacement] = useState(profileData.currency_placement)
  const {validate, validationResult} = useValidation({
    first_name: ['required'],
    last_name: ['required'],
    currency_symbol: ['required']
  })

  const close = () => {
    dispatch(hideModal('manageAccount'))
  }

  const doUpdateAccount = async () => {
    updateAccount({
      prefix: ' ',
      first_name: firstName,
      last_name: lastName,
      currency_symbol: currencySymbol,
      currency_placement: currencyPlacement
    }).then(() => {
        updated()
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
      currency_symbol: currencySymbol,
      currency_placement: currencyPlacement
    })) {
      return
    }
    doUpdateAccount().catch(e => {
      console.log(e.message)
    })
  }

  useEffect(() => {
    setFirstName(profileData.first_name)
    setLastName(profileData.last_name)
    setCurrencyPlacement(profileData.currency_placement)
    setCurrencySymbol(profileData.currency_symbol)
  }, [profileData])

  return (
    <Portal>
      <Dialog style={dialogStyles} visible={signupVisible} onDismiss={close}>
        <Dialog.Title>Sign Up</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingVertical: 14}}>
            <Stack spacing={2}>
              <TextInput error={validationResult.first_name} onChangeText={(v) => setProfileData({...profileData, first_name: v})} value={profileData.first_name} label="First Name" mode="flat"/>
              {validationResult.first_name && <HelperText type="error" visible={validationResult.first_name}>
                {validationResult.first_name}
              </HelperText>}
            </Stack>
            <Stack spacing={2}>
              <TextInput error={validationResult.last_name} onChangeText={(v) => setLastName(v)} value={lastName} label="Last Name" mode="flat"/>
              {validationResult.last_name && <HelperText type="error" visible={validationResult.last_name}>
                {validationResult.last_name}
              </HelperText>}
            </Stack>
            <Stack spacing={2}>
              <TextInput error={validationResult.currency_symbol} autoCapitalize='none' onChangeText={(v) => setCurrencySymbol(v)} value={currencySymbol}
                         label="Currency Symbol" mode="flat"/>
              {validationResult.currency_symbol && <HelperText type="error" visible={validationResult.currency_symbol}>
                {validationResult.currency_symbol}
              </HelperText>}
            </Stack>
            <Stack spacing={2}>
              <Paragraph>Currency Symbol Placement</Paragraph>
              <Row>
                <RadioButton
                  value={true}
                  status={currencyPlacement === true ? 'checked' : 'unchecked'}
                  onPress={() => setCurrencyPlacement(true)}
                />
                <RadioLabel>Before</RadioLabel>
                <RadioButton
                  value={false}
                  status={currencyPlacement === false ? 'checked' : 'unchecked'}
                  onPress={() => setCurrencyPlacement(false)}
                />
                <RadioLabel>After</RadioLabel>
              </Row>
            </Stack>
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

export default UpdateProfileDialog

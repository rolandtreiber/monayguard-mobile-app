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
import useValidation from "../../hooks/use-validation";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const ImportanceLevelDialog = ({id, updated, type}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.manageImportanceLevel)
  const [error, setError] = useState('')
  const {createImportanceLevel, updateImportanceLevel, getImportanceLevel} = useContext(APIContext)
  const [name, setName] = useState('')
  const [level, setLevel] = useState("1")
  const {dialogStyles} = useKeyboardState()
  const {validate, validationResult} = useValidation({
    name: ['required'],
    level: ['required', 'positive']
  })

  useEffect(() => {
    id && getImportanceLevel(id).then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && response.status) {
          setName(data.name)
          setLevel(data.level.toString())
        }
      }
    })
  }, [id])

  const close = () => {
    clear()
    dispatch(hideModal('manageImportanceLevel'))
  }

  const submit = async () => {
    if (!validate({name, level})) {
      return
    }
    if (!id) {
      createImportanceLevel({
        name, level, type
      }).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            updated()
            close()
          }
        }
      }).catch(e => {
        const {response} = e
        if (response) {
          setError("Something went wrong.")
        }
      })
    } else {
      updateImportanceLevel(id, {
        name, level, type
      }).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            updated()
            close()
          }
        }
      }).catch(e => {
        const {response} = e
        if (response) {
          setError("Something went wrong.")
        }
      })
    }
  }

  const clear = () => {
    setName('')
    setLevel(1)
    setError('')
  }

  return (
    <Portal>
      <Dialog style={dialogStyles} visible={visible} onDismiss={close}>
        <Dialog.Title>
          {id ? "Update" : "Create"} Importance Level
        </Dialog.Title>
        <Dialog.Content>
          <Stack spacing={2}>
            <TextInput error={validationResult.name} onChangeText={(v) => setName(v)} value={name} label="Name"
                       mode="flat"/>
            {validationResult.name && <HelperText type="error" visible={validationResult.name}>
              {validationResult.name}
            </HelperText>}
          </Stack>
          <Stack spacing={2}>
            <TextInput error={validationResult.level} onChangeText={(v) => setLevel(v)} value={level} keyboardType='numeric' label="Level"
                       mode="flat"/>
            {validationResult.level && <HelperText type="error" visible={validationResult.level}>
              {validationResult.level}
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

export default ImportanceLevelDialog

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

const CategoryDialog = ({id, updated, type}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.manageCategory)
  const [error, setError] = useState('')
  const {createCategory, updateCategory, getCategory} = useContext(APIContext)
  const [name, setName] = useState('')
  const {dialogStyles} = useKeyboardState()
  const {validate, validationResult} = useValidation({
    name: ['required']
  })

  useEffect(() => {
    id && getCategory(id).then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && response.status) {
          setName(data.name)
        }
      }
    }).catch(e => {
      console.log(e.message)
    })
  }, [id])

  const close = () => {
    clear()
    dispatch(hideModal('manageCategory'))
  }

  const submit = async () => {
    if (!validate({name})) {
      return
    }
    if (!id) {
      createCategory({
        name, type
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
      updateCategory(id, {
        name, type
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
    setError('')
  }

  return (
    <Portal>
      <Dialog style={dialogStyles} visible={visible} onDismiss={close}>
        <Dialog.Title>
          {id ? "Update" : "Create"} Category
        </Dialog.Title>
        <Dialog.Content>
          <Stack spacing={2}>
            <TextInput error={validationResult.name} onChangeText={(v) => setName(v)} value={name} label="Name" mode="flat"/>
            {validationResult.name && <HelperText type="error" visible={validationResult.name}>
              {validationResult.name}
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

export default CategoryDialog

import React from "react";
import {
  Button, Paragraph, Dialog, Portal,
} from "react-native-paper";
import useKeyboardState from "../../hooks/use-keyboard-state";


const ConfirmationDialog = ({callback, title, body, visible, setVisible}) => {
  const {dialogStyles} = useKeyboardState()

  const close = () => {
    setVisible(false)
  }

  const submit = () => {
    callback()
    setVisible(false)
  }

  return (
    <Portal>
      <Dialog style={dialogStyles} visible={visible} onDismiss={close}>
        <Dialog.Title>
          {title ? title : "Are you sure?"}
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph variant={"body2"}>{body}</Paragraph>
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
            onPress={submit}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default ConfirmationDialog

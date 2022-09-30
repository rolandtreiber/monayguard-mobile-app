import React, {useContext, useEffect, useState} from "react";
import {
  Button, Paragraph, Dialog,
  TextInput as BaseTextInput, Checkbox,
} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {hideModal} from "../../redux/actions/dialogActions";
import styled from "styled-components/native";
import Stack from "../stack";
import CategoryPicker from "../category-picker";
import {ScrollView} from "react-native";
import {RadioLabel, Row} from "../shared-styled-components";
import TagPicker from "../tag-picker";
import useKeyboardState from "../../hooks/use-keyboard-state";
import usePickable from "../../hooks/use-pickable";
import ImportanceLevelPicker from "../importance-level-picker";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const TransactionAdvancedSearchDialog = ({filter, setFilter}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.transactionAdvancedSearch)
  const importanceLevels = useSelector((state) => state.select.importanceLevels)
  const [error, setError] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [type, setType] = useState(2)
  const [selectedImportanceLevels, setSelectedImportanceLevels] = useState([])
  const {dialogStyles} = useKeyboardState()
  const {loadImportanceLevels, loadTags, loadCategories} = usePickable()
  const types = filter.types

  useEffect(() => {
    loadImportanceLevels().catch(e => console.log(e.message))
  }, [filter])

  useEffect(() => {
    setFilter({
      ...filter,
      tags: [...selectedTags],
      categories: [...selectedCategories],
      importance_levels: [...selectedImportanceLevels]
    })
  }, [selectedTags, selectedCategories, selectedImportanceLevels])

  const close = () => {
    dispatch(hideModal('transactionAdvancedSearch'))
  }

  const clear = () => {
    setError('')
  }

  useEffect(() => {
    if (types && types.length === 1) {
      loadCategories(types[0], '')
      loadTags(types[0], '')
    }
  }, [types])

  const toggleType = (type) => {
    const types = [...filter.types]
    if (filter.types.indexOf(type) !== -1) {
      types.splice(filter.types.indexOf(type), 1)
      setFilter({
        ...filter,
        types: types
      })
    } else {
      setFilter({
        ...filter,
        types: [...filter.types, type]
      })
    }
  }

  useEffect(() => {
    setSelectedCategories([])
    setSelectedTags([])
  }, [type])

  const submit = () => {
    close()
  }

  return (
    <Dialog style={dialogStyles} visible={visible} onDismiss={close}>
      <Dialog.Title>
        Advanced Search
      </Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView contentContainerStyle={{paddingVertical: 14}}>
          {importanceLevels && filter.types.length === 1 && filter.types[0] === 2 &&
            <ImportanceLevelPicker selected={selectedImportanceLevels} setSelected={setSelectedImportanceLevels}/>}
          {filter.types && <Row>
            <RadioLabel>Income</RadioLabel>
            <Checkbox
              status={filter.types.indexOf(1) !== -1 ? 'checked' : 'unchecked'}
              onPress={() => {
                toggleType(1)
              }}
            />
            <RadioLabel>Expense</RadioLabel>
            <Checkbox
              status={filter.types.indexOf(2) !== -1 ? 'checked' : 'unchecked'}
              onPress={() => {
                toggleType(2)
              }}
            />
            <RadioLabel>Saving</RadioLabel>
            <Checkbox
              status={filter.types.indexOf(3) !== -1 ? 'checked' : 'unchecked'}
              onPress={() => {
                toggleType(3)
              }}
            />
          </Row>}
          {filter.types && filter.types.length === 1 && <>
            <Stack>
              <CategoryPicker type={type} selected={selectedCategories} setSelected={setSelectedCategories}/>
            </Stack>
            <Stack>
              <TagPicker type={type} selected={selectedTags} setSelected={setSelectedTags}/>
            </Stack>
          </>
          }
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
      onPress={() => submit()}
    >
      Ok
    </Button>
  </Dialog.Actions>
</Dialog>
)
}

export default TransactionAdvancedSearchDialog

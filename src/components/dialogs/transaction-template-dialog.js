import React, {useContext, useEffect, useState} from "react";
import {
  Button, Paragraph, Dialog,
  TextInput as BaseTextInput,
  ActivityIndicator
} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {hideModal} from "../../redux/actions/dialogActions";
import {APIContext} from "../../context/api-context";
import styled from "styled-components/native";
import Stack from "../stack";
import CategoryPicker from "../category-picker";
import {ScrollView} from "react-native";
import TagPicker from "../tag-picker";
import useKeyboardState from "../../hooks/use-keyboard-state";
import {Picker} from '@react-native-picker/picker';
import usePickable from "../../hooks/use-pickable";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const TransactionDialog = ({id, updated}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.transactionFromTemplate)
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState('')
  const {createTransaction, getTemplate, getTemplatesList} = useContext(APIContext)
  const [name, setName] = useState('')
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedImportanceLevel, setSelectedImportanceLevel] = useState()
  const [type, setType] = useState(2)
  const {dialogStyles} = useKeyboardState()
  const {loadImportanceLevels} = usePickable()
  const [isLoading, setIsLoading] = useState(true)
  const [templateData, setTemplateData] = useState()

  useEffect(() => {
    setIsLoading(true)
    getTemplatesList().then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && response.status) {
          setTemplates(data)
        }
      }
    }).catch(e => {
      const {response} = e
      if (response) {
        setError("Could not load the templates.")
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  const fetchTemplate = (id) => {
    id && getTemplate(id).then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && response.status) {
          setTemplateData(data)
        }
      }
    }).catch(e => {
      const {response} = e
      console.log(id)
      if (response) {
        setError("Could not load the templates.")
      }
    })
  }

  useEffect(() => {
    loadImportanceLevels().catch(e => console.log(e.message))
  }, [type])

  useEffect(() => {
    fetchTemplate(selectedTemplate)
  }, [selectedTemplate])

  useEffect(() => {
    if (templateData) {
      setName(templateData.name)
      setType(templateData.type)
      setSelectedCategories(templateData.categories.map(c => {
        return {
          text: c.name,
          value: c.id
        }
      }))
      setSelectedTags(templateData.tags.map(c => {
        return {
          text: c.name,
          value: c.id
        }
      }))
      setSelectedImportanceLevel(templateData.importance_level?.id)
    }
  }, [templateData])

  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0].value)
    }
  }, [templates])

  const close = () => {
    dispatch(hideModal('transactionFromTemplate'))
  }

  const submit = async () => {
    createTransaction({
      name,
      type,
      categories: selectedCategories.map(c => c.value),
      tags: selectedTags.map(t => t.value),
      amount,
      importance_level: selectedImportanceLevel
    }).then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && response.status) {
          updated()
          close()
        }
      }
    }).finally(() => clear())
      .catch(e => {
        const {response} = e
        console.log({
          name, type,
          categories: selectedCategories.map(c => c.value),
          tags: selectedTags.map(t => t.value),
          importance_level: selectedImportanceLevel
        })

        if (response) {
          setError("Something went wrong.")
        }
      }).catch(e => {
      const {response} = e
      if (response) {
        setError("Something went wrong.")
      }
    })
  }

  const clear = () => {
    setName('')
    setError('')
    setAmount(0)
  }

  return (
    <Dialog style={dialogStyles} visible={visible} onDismiss={close}>
      <Dialog.Title>
        {id ? "Update" : "Create"} Transaction
      </Dialog.Title>
      {isLoading ? <ActivityIndicator/> : <Dialog.ScrollArea>
        <ScrollView contentContainerStyle={{paddingVertical: 14}}>
          {templates && <>
            <Paragraph style={{alignSelf: "flex-start"}}>Template</Paragraph>
            <Picker
              selectedValue={selectedTemplate}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedTemplate(itemValue)
              }>
              {templates.map(t => <Picker.Item key={t.value} label={t.text} value={t.value}/>)}
            </Picker>
          </>
          }
          <Stack spacing={2}>
            <TextInput onChangeText={(v) => setName(v)} value={name} label="Name" mode="flat"/>
          </Stack>
          <Stack spacing={2}>
            <TextInput onChangeText={(v) => setAmount(v)} value={amount.toString()} keyboardType='numeric' label="Value"
                       mode="flat"/>
          </Stack>
          <Stack>
            <CategoryPicker type={type} selected={selectedCategories} setSelected={setSelectedCategories}/>
          </Stack>
          <Stack>
            <TagPicker type={type} selected={selectedTags} setSelected={setSelectedTags}/>
          </Stack>
          {error && <ErrorMessage variant={"body2"}>{error}</ErrorMessage>}
        </ScrollView>
      </Dialog.ScrollArea>}
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

export default TransactionDialog

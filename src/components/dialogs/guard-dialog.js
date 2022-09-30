import React, {useContext, useEffect, useState} from "react";
import {
  Button, Paragraph, Dialog,
  TextInput as BaseTextInput,
  ActivityIndicator, HelperText
} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {hideModal} from "../../redux/actions/dialogActions";
import {APIContext} from "../../context/api-context";
import styled from "styled-components/native";
import Stack from "../stack";
import CategoryPicker from "../category-picker";
import {ScrollView} from "react-native";
import {RadioButton, RadioLabel, Row} from "../shared-styled-components";
import TagPicker from "../tag-picker";
import useKeyboardState from "../../hooks/use-keyboard-state";
import {formatDateForApi} from "../../utils/utils";
import FrequencySelector from "../frequency-selector";
import useValidation from "../../hooks/use-validation";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const GuardDialog = ({id, updated}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.manageGuard)
  const [error, setError] = useState('')
  const {createGuard, updateGuard, getGuard} = useContext(APIContext)
  const [name, setName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [type, setType] = useState(2)
  const {dialogStyles} = useKeyboardState()
  const [isLoading, setIsLoading] = useState(true)
  const [frequency, setFrequency] = useState(1)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  const [frequencyBasis, setFrequencyBasis] = useState(1)
  const [threshold, setThreshold] = useState(0)
  const {validate, validationResult} = useValidation({
    name: ['required'],
    frequency_basis: ['required', 'positive'],
    threshold: ['required', 'positive']
  })

  useEffect(() => {
    setIsLoading(true)

    if (id) {
      getGuard(id).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            setName(data.name)
            setType(data.type)
            const loadedCategories = []
            const loadedTags = []
            setThreshold(data.threshold)
            setFrequency(data.frequency)
            setFrequencyBasis(data.frequency_basis)
            data.categories.forEach(item => {
              loadedCategories.push({
                text: item.name,
                value: item.id
              })
            })
            data.tags.forEach(item => {
              loadedTags.push({
                text: item.name,
                value: item.id
              })
            })
            setSelectedCategories(loadedCategories)
            setSelectedTags(loadedTags)
          }
        }
      }).finally(() => setIsLoading(false)).catch(e => console.log(e.message))
    } else {
      setName('')
      setSelectedCategories([])
      setSelectedTags([])
      setError('')
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    setSelectedCategories([])
    setSelectedTags([])
  }, [type])

  const close = () => {
    dispatch(hideModal('manageGuard'))
  }

  const submit = async () => {
    if (!validate({
      name,
      threshold,
      frequency_basis: frequencyBasis
    })) {
      return
    }
    if (!id) {
      createGuard({
        name,
        type,
        categories: selectedCategories.map(c => c.value),
        tags: selectedTags.map(t => t.value),
        frequency,
        frequency_basis: frequencyBasis,
        threshold,
        start_date: formatDateForApi(startDate),
        end_date: formatDateForApi(endDate)
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
          })

          if (response) {
            setError("Something went wrong.")
          }
        })
    } else {
      updateGuard(id, {
        name,
        type,
        categories: selectedCategories.map(c => c.value),
        tags: selectedTags.map(t => t.value),
        frequency,
        frequency_basis: frequencyBasis,
        threshold,
        start_date: formatDateForApi(startDate),
        end_date: formatDateForApi(endDate)
      }).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            updated()
            close()
          }
        }
      }).catch(e => {
        console.log({
          name, type,
          categories: selectedCategories.map(c => c.value),
          tags: selectedTags.map(t => t.value),
        })
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
    <Dialog style={dialogStyles} visible={visible} onDismiss={close}>
      <Dialog.Title>
        {id ? "Update" : "Create"} Guard
      </Dialog.Title>
        {isLoading ? <ActivityIndicator/> : <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingVertical: 14}}>
          <Stack spacing={2}>
            <FrequencySelector error={validationResult.frequency_basis} frequency={frequency} frequencyBasis={frequencyBasis} setFrequency={setFrequency}
                               setFrequencyBasis={setFrequencyBasis} wording={"interval"}/>
            {validationResult.frequency_basis && <HelperText type="error" visible={validationResult.frequency_basis}>
              {validationResult.frequency_basis}
            </HelperText>}
          </Stack>
          {!id && <Row>
            <RadioLabel>Income</RadioLabel>
            <RadioButton
              value={1}
              status={type === 1 ? 'checked' : 'unchecked'}
              onPress={() => setType(1)}
            />
            <RadioLabel>Expense</RadioLabel>
            <RadioButton
              value={1}
              status={type === 2 ? 'checked' : 'unchecked'}
              onPress={() => setType(2)}
            />
            <RadioLabel>Saving</RadioLabel>
            <RadioButton
              value={1}
              status={type === 3 ? 'checked' : 'unchecked'}
              onPress={() => setType(3)}
            />
          </Row>}
          <Stack spacing={2}>
            <TextInput error={validationResult.name} onChangeText={(v) => setName(v)} value={name} label="Name" mode="flat"/>
            {validationResult.name && <HelperText type="error" visible={validationResult.name}>
              {validationResult.name}
            </HelperText>}
          </Stack>
          <Stack spacing={2}>
            <TextInput error={validationResult.threshold} onChangeText={(v) => setThreshold(v)} value={threshold.toString()} keyboardType='numeric' label="Threshold" mode="flat"/>
            {validationResult.threshold && <HelperText type="error" visible={validationResult.threshold}>
              {validationResult.threshold}
            </HelperText>}
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

export default GuardDialog

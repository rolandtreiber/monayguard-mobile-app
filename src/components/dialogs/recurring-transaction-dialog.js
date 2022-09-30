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
import {Picker} from '@react-native-picker/picker';
import usePickable from "../../hooks/use-pickable";
import FrequencySelector from "../frequency-selector";
import {DatePickerInput} from "react-native-paper-dates";
import {formatDateForApi} from "../../utils/utils";
import useValidation from "../../hooks/use-validation";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const RecurringTransactionDialog = ({id, updated}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.manageCategory)
  const importanceLevels = useSelector((state) => state.select.importanceLevels)
  const [error, setError] = useState('')
  const {createRecurringTransaction, updateRecurringTransaction, getRecurringTransaction} = useContext(APIContext)
  const [name, setName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedImportanceLevel, setSelectedImportanceLevel] = useState()
  const [type, setType] = useState(2)
  const {dialogStyles} = useKeyboardState()
  const {loadImportanceLevels} = usePickable()
  const [isLoading, setIsLoading] = useState(true)
  const [frequency, setFrequency] = useState(1)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  const [frequencyBasis, setFrequencyBasis] = useState(1)
  const [amount, setAmount] = useState(0)
  const {validate, validationResult} = useValidation({
    name: ['required'],
    frequency_basis: ['required', 'positive'],
    amount: ['required', 'positive']
  })

  useEffect(() => {
    setIsLoading(true)
    if (id) {
      getRecurringTransaction(id).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            setName(data.name)
            setType(data.type)
            setAmount(data.amount)
            setSelectedImportanceLevel(data.importance_level.id)
            const loadedCategories = []
            const loadedTags = []
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
            setFrequency(data.frequency)
            setFrequencyBasis(data.frequency_basis)
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
    if (importanceLevels && !selectedImportanceLevel && importanceLevels.length > 0) {
      setSelectedImportanceLevel(importanceLevels[0].value)
    }
  }, [selectedImportanceLevel, importanceLevels])

  useEffect(() => {
    loadImportanceLevels().catch(e => console.log(e.message))
  }, [type])

  useEffect(() => {
    setSelectedCategories([])
    setSelectedTags([])
  }, [type])

  const close = () => {
    dispatch(hideModal('manageCategory'))
  }

  const submit = async () => {
    if (!validate({
      name,
      amount,
      frequency_basis: frequencyBasis
    })) {
      return
    }
    if (!id) {
      createRecurringTransaction({
        name,
        type,
        categories: selectedCategories.map(c => c.value),
        tags: selectedTags.map(t => t.value),
        importance_level: selectedImportanceLevel,
        frequency,
        frequency_basis: frequencyBasis,
        amount,
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
            importance_level: selectedImportanceLevel
          })

          if (response) {
            setError("Something went wrong.")
          }
        })
    } else {
      updateRecurringTransaction(id, {
        name,
        type,
        categories: selectedCategories.map(c => c.value),
        tags: selectedTags.map(t => t.value),
        importance_level: selectedImportanceLevel,
        frequency,
        frequency_basis: frequencyBasis,
        amount,
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
          importance_level: selectedImportanceLevel
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
        {id ? "Update" : "Create"} Recurring Transaction
      </Dialog.Title>
      {isLoading ? <ActivityIndicator/> : <Dialog.ScrollArea>
        <ScrollView contentContainerStyle={{paddingVertical: 14}}>
          {importanceLevels && type === 2 && <>
            <Paragraph style={{alignSelf: "flex-start"}}>Importance</Paragraph>
            <Picker
              selectedValue={selectedImportanceLevel}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedImportanceLevel(itemValue)
              }>
              {importanceLevels.map(level => <Picker.Item key={level.value} label={level.text} value={level.value}/>)}
            </Picker>
          </>
          }
          <DatePickerInput
            locale="en"
            label="Start Date"
            value={startDate}
            onChange={(d) => setStartDate(d)}
            inputMode="start"
          />
          <DatePickerInput
            locale="en"
            label="End Date"
            value={endDate}
            onChange={(d) => setEndDate(d)}
            inputMode="start"
          />
          <FrequencySelector error={validationResult.frequency_basis} frequency={frequency} frequencyBasis={frequencyBasis} setFrequency={setFrequency}
                             setFrequencyBasis={setFrequencyBasis}/>
          {validationResult.frequency_basis && <HelperText type="error" visible={validationResult.frequency_basis}>
            {validationResult.frequency_basis}
          </HelperText>}

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
            <TextInput error={validationResult.amount} onChangeText={(v) => setAmount(v)} value={amount.toString()} keyboardType='numeric' label="Value"
                       mode="flat"/>
            {validationResult.amount && <HelperText type="error" visible={validationResult.amount}>
              {validationResult.amount}
            </HelperText>}

          </Stack>
          <Stack spacing={2}>
            <TextInput error={validationResult.name} onChangeText={(v) => setName(v)} value={name} label="Name" mode="flat"/>
            {validationResult.name && <HelperText type="error" visible={validationResult.name}>
              {validationResult.name}
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

export default RecurringTransactionDialog

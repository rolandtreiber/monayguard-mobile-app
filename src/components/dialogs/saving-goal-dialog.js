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
import TagPicker from "../tag-picker";
import useKeyboardState from "../../hooks/use-keyboard-state";
import usePickable from "../../hooks/use-pickable";
import {DatePickerInput} from "react-native-paper-dates";
import FrequencySelector from "../frequency-selector";
import {formatDateForApi} from "../../utils/utils";
import useValidation from "../../hooks/use-validation";

const ErrorMessage = styled(Paragraph)`
  margin-top: 10px;
  font-size: 12px;
`

const TextInput = styled(BaseTextInput)`
  margin-bottom: 10px;
`

const SavingGoalDialog = ({id, updated}) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.dialog.dialogVisibilityData.manageSavingGoal)
  const importanceLevels = useSelector((state) => state.select.importanceLevels)
  const [error, setError] = useState('')
  const {createSavingGoal, updateSavingGoal, getSavingGoal} = useContext(APIContext)
  const [name, setName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedImportanceLevel, setSelectedImportanceLevel] = useState()
  const [type, setType] = useState(3)
  const {dialogStyles} = useKeyboardState()
  const {loadImportanceLevels} = usePickable()
  const [isLoading, setIsLoading] = useState(true)
  const [frequency, setFrequency] = useState(1)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  const [frequencyBasis, setFrequencyBasis] = useState(1)
  const [target, setTarget] = useState(1000)
  const {validate, validationResult} = useValidation({
    name: ['required'],
    frequency_basis: ['required', 'positive'],
    target: ['required', 'positive']
  })

  const totalDays = () => {
    const difference = endDate.getTime() - startDate.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  useEffect(() => {
    setIsLoading(true)

    if (id) {
      getSavingGoal(id).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            setName(data.name)
            setType(3)
            setTarget(data.target)
            setFrequency(data.frequency)
            setFrequencyBasis(data.frequency_basis)
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
          }
        }
      }).finally(() => setIsLoading(false)).catch(e => console.log(e.message))
    } else {
      setName('')
      setSelectedCategories([])
      setSelectedTags([])
      setError('')
      setType(3)
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
    dispatch(hideModal('manageSavingGoal'))
  }

  const submit = async () => {
    if (!validate({
      name,
      target,
      frequency_basis: frequencyBasis
    })) {
      return
    }

    if (!id) {
      createSavingGoal({
        name,
        type,
        categories: selectedCategories.map(c => c.value),
        tags: selectedTags.map(t => t.value),
        frequency,
        frequency_basis: frequencyBasis,
        target,
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
      updateSavingGoal(id, {
        name, type,
        categories: selectedCategories.map(c => c.value),
        tags: selectedTags.map(t => t.value),
        frequency,
        frequency_basis: frequencyBasis,
        target,
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
        {id ? "Update" : "Create"} Saving Goal
      </Dialog.Title>
      {isLoading ? <ActivityIndicator/> : <Dialog.ScrollArea>
        <ScrollView contentContainerStyle={{paddingVertical: 14}}>
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
          <FrequencySelector error={validationResult.frequency_basis} wording={"saving"} target={target}
                             totalDays={totalDays} frequency={frequency} frequencyBasis={frequencyBasis}
                             setFrequency={setFrequency} setFrequencyBasis={setFrequencyBasis}/>
          {validationResult.frequency_basis && <HelperText type="error" visible={validationResult.frequency_basis}>
            {validationResult.frequency_basis}
          </HelperText>}

          <Stack spacing={2}>
            <TextInput error={validationResult.name} onChangeText={(v) => setName(v)} value={name} label="Name" mode="flat"/>
            {validationResult.name && <HelperText type="error" visible={validationResult.name}>
              {validationResult.name}
            </HelperText>}
          </Stack>
          <Stack spacing={2}>
            <TextInput error={validationResult.target} onChangeText={(v) => setTarget(v)} value={target.toString()} keyboardType='numeric'
                       label="Total target" mode="flat"/>
            {validationResult.target && <HelperText type="error" visible={validationResult.target}>
              {validationResult.target}
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

export default SavingGoalDialog

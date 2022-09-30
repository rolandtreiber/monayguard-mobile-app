import React, {useEffect} from "react";
import {Paragraph, TextInput} from "react-native-paper";
import {RadioButton, RadioLabel, Row} from "./shared-styled-components";
import Stack from "./stack";
import {dayOfMonthString, nthString, weekDays} from "../utils/utils";
import {useSelector} from "react-redux";

const FrequencySelector = ({
                             wording = "frequency",
                             frequency,
                             frequencyBasis,
                             setFrequency,
                             setFrequencyBasis,
                             target = null,
                             totalDays = null,
                              error = false
                           }) => {
  const userData = useSelector((state) => state.user.userData)
  const symbol = userData.currency_symbol

  useEffect(() => {
    if ((parseInt(frequencyBasis) > 7 && frequency === 1) || (parseInt(frequencyBasis) > 28 && frequency === 4)) {
      setFrequency(2)
    }
  }, [frequencyBasis])

  const names = () => {
    switch (wording) {
      case "frequency":
        return [
          "On each " + weekDays(frequencyBasis),
          "Every" + nthString(frequencyBasis) + " Day",
          "Every" + nthString(frequencyBasis) + " Week",
          "On the" + dayOfMonthString(frequencyBasis) + " of each month"
        ]
      case "interval":
        return [
          "Weekly (" + weekDays(frequencyBasis) + " to " + weekDays(parseInt(frequencyBasis) !== 1 ? frequencyBasis - 1 : 7) + ")",
          "Interval of " + frequencyBasis + " Day" + (frequencyBasis > 1 ? "s" : ''),
          "Interval of " + frequencyBasis + " Week" + (frequencyBasis > 1 ? "s" : ''),
          "Monthly (" + dayOfMonthString(frequencyBasis) + " to " + dayOfMonthString(frequencyBasis) + ")"
        ]
      case "saving":
        const weekly = (calculateSubTargets() && calculateSubTargets()[0]) ? "~"+symbol+calculateSubTargets()[0] : ''
        const ndays = (calculateSubTargets() && calculateSubTargets()[1]) ? "~"+symbol+calculateSubTargets()[1] : ''
        const nweeks = (calculateSubTargets() && calculateSubTargets()[2]) ? "~"+symbol+calculateSubTargets()[2] : ''
        const monthly = (calculateSubTargets() && calculateSubTargets()[3]) ? "~"+symbol+calculateSubTargets()[3] : ''
        return [
          weekly+" Weekly (" + weekDays(frequencyBasis) + " to " + weekDays(parseInt(frequencyBasis) !== 1 ? frequencyBasis - 1 : 7) + ")",
          ndays+" Interval of " + frequencyBasis + " Day" + (frequencyBasis > 1 ? "s" : ''),
          nweeks+" Interval of " + frequencyBasis + " Week" + (frequencyBasis > 1 ? "s" : ''),
          monthly+" Monthly (" + dayOfMonthString(frequencyBasis) + " to " + dayOfMonthString(frequencyBasis) + ")"
        ]
    }
  }

  const title = () => {
    switch (wording) {
      case "frequency":
        return "Frequency"
      case "interval":
        return "Interval"
      case "saving":
        return "Progress tracker"
    }
  }

  const calculateSubTargets = () => {
    if (target && totalDays) {
      const weeks = Math.ceil(target / Math.floor(totalDays() / 7))
      const ndays = Math.ceil(target / Math.floor(totalDays() / frequencyBasis))
      const nweeks = Math.ceil(target / Math.floor(totalDays() / (frequencyBasis * 7)))
      const monthly = Math.ceil(target / Math.floor(totalDays() / 30))

      return [
        !isNaN(weeks) ? weeks : null,
        !isNaN(ndays) ? ndays : null,
        !isNaN(nweeks) ? nweeks : null,
        !isNaN(monthly) ? monthly : null
      ]
    }
    return null
  }

  return (
    <>
      <Row>
        <Paragraph style={{alignSelf: "center", marginTop: 10}}>{title()}</Paragraph>
      </Row>
      {frequencyBasis && <>
        {parseInt(frequencyBasis) < 8 && <Row>
          <RadioLabel>{names()[0]}</RadioLabel>
          <RadioButton
            value={1}
            status={frequency === 1 ? 'checked' : 'unchecked'}
            onPress={() => setFrequency(1)}
          />
        </Row>}
        <Row>
          <RadioLabel>{names()[1]}</RadioLabel>
          <RadioButton
            value={2}
            status={frequency === 2 ? 'checked' : 'unchecked'}
            onPress={() => setFrequency(2)}
          />
        </Row>
        <Row>
          <RadioLabel>{names()[2]}</RadioLabel>
          <RadioButton
            value={3}
            status={frequency === 3 ? 'checked' : 'unchecked'}
            onPress={() => setFrequency(3)}
          />
        </Row>
        {parseInt(frequencyBasis) < 29 && <Row>
          <RadioLabel>{names()[3]}</RadioLabel>
          <RadioButton
            value={4}
            status={frequency === 4 ? 'checked' : 'unchecked'}
            onPress={() => setFrequency(4)}
          />
        </Row>}
      </>}
      <Stack spacing={2}>
        <TextInput error={error} onChangeText={(v) => setFrequencyBasis(v)} value={frequencyBasis.toString()} keyboardType='numeric'
                   label="Frequency Basis" mode="flat"/>
      </Stack>
    </>
  )
}

export default FrequencySelector

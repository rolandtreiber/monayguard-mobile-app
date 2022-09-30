import React, {useMemo, useState} from "react"
import {VALIDATOR_STATE_INITIAL, VALIDATOR_STATE_OFF, VALIDATOR_STATE_ON} from "../utils/utils";

const useValidation = (rules = {}) => {
  const [result, setResult] = useState({})
  const [validatorState, setValidatorState] = useState(VALIDATOR_STATE_INITIAL)

  const validateElement = (key, value) => {
    const ruleKeys = Object.keys(rules)
    if (ruleKeys.indexOf(key) !== -1) {
      const rule = rules[key]
      if (rule.indexOf('required') !== -1 && (!value || value.length < 1)) {
        return key + " is required"
      }
      if (rule.indexOf('positive') !== -1 && (!value || parseFloat(value) <= 0)) {
        return key + " needs to be a positive number"
      }
      if (rule.indexOf('email') !== -1 && (value && (value.indexOf('@') === -1 || value.indexOf('.') === -1) || value.length < 4)) {
        return key + " needs to be a valid email address"
      }
    }
    return true
  }

  const validate = (data) => {
    setValidatorState(VALIDATOR_STATE_ON)
    let valid = true;
    let result = {}
    Object.keys(data).forEach(key => {
      const elementValidationResult = validateElement(key, data[key])
      if (elementValidationResult !== true) {
        result[key] = elementValidationResult
        valid = false
      }
    })
    setResult(result)
    return valid
  }

  const pauseValidator = () => {
    setValidatorState(VALIDATOR_STATE_OFF)
  }

  const resetValidator = () => {
    setResult([])
    setValidatorState(VALIDATOR_STATE_INITIAL)
  }

  return useMemo(
    () => ({
      validate,
      pauseValidator,
      resetValidator,
      validationResult: result,
      validatorState
    }),
    [rules]
  )
}

export default useValidation

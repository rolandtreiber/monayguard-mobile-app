export const formatDateForApi = (date = new Date()) => date.getFullYear()+'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+date.getDate().toString().padStart(2, '0')
export const formatDateToDisplay = (date = new Date()) => date.getDate().toString().padStart(2, '0')+'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+date.getFullYear()
export const formatDateTimeToDisplay = (date = new Date()) => date.getDate().toString().padStart(2, '0')+'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()

export const VALIDATOR_STATE_INITIAL = "VALIDATOR_STATE_INITIAL"
export const VALIDATOR_STATE_ON = "VALIDATOR_STATE_ON"
export const VALIDATOR_STATE_OFF = "VALIDATOR_STATE_OFF"

export const nthString = (n) => {
  switch (parseInt(n)) {
    case 1:
      return ''
    case 2:
      return ' other'
    case 3:
      return ' 3rd'
    default:
      return ' ' + n + 'th'
  }
}

export const dayOfMonthString = (n) => {
  switch (parseInt(n)) {
    case 1:
      return ' 1st'
    case 2:
      return ' 2nd'
    case 3:
      return ' 3rd'
    default:
      return ' ' + n + 'th'
  }
}

export const weekDays = (n) => {
  switch (parseInt(n)) {
    case 1:
      return 'Monday'
    case 2:
      return 'Tuesday'
    case 3:
      return 'Wednesday'
    case 4:
      return 'Thursday'
    case 5:
      return 'Friday'
    case 6:
      return 'Saturday'
    case 7:
      return 'Sunday'
  }
}

export const roundTo2Decimals = (value) => {
  return Math.round(value * 100) / 100
}

export const getGuardInterval = (frequency, frequencyBasis) => {
  switch (frequency) {
    case 1:
      return "Weekly (" + weekDays(frequencyBasis) + " to " + weekDays(parseInt(frequencyBasis) !== 1 ? frequencyBasis - 1 : 7) + ")"
    case 2:
      return "Interval of " + frequencyBasis + " Day" + (frequencyBasis > 1 ? "s" : '')
    case 3:
      return "Interval of " + frequencyBasis + " Week" + (frequencyBasis > 1 ? "s" : '')
    case 4:
      return "Monthly (" + dayOfMonthString(frequencyBasis) + " to " + dayOfMonthString(frequencyBasis) + ")"
  }
}

export const getRecurringTransactionFrequency = (frequency, frequencyBasis) => {
  switch (frequency) {
    case 1:
      return "On each " + weekDays(frequencyBasis)
    case 2:
      return "Every" + nthString(frequencyBasis) + " Day"
    case 3:
      return "Every" + nthString(frequencyBasis) + " Week"
    case 4:
      return "On the" + dayOfMonthString(frequencyBasis) + " of each month"
  }
}

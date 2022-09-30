import React from "react";
import {Chip} from "react-native-paper";

const TypeChip = ({type}) => {
  const name = () => {
    switch (type) {
      case 1:
        return "Income"
      case 2:
        return "Expense"
      case 3:
        return "Saving"
    }
  }

  const color = () => {
    switch (type) {
      case 1:
        return "#1aa12c"
      case 2:
        return "#A11A1AFF"
      case 3:
        return "#a19a1a"
    }
  }

  return <Chip style={{backgroundColor: color()}}>{name()}</Chip>
}

export default TypeChip

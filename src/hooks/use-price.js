import React, {useMemo} from "react"
import {useSelector} from "react-redux";

const usePrice = () => {
  const userData = useSelector((state) => state.user.userData)
  const symbol = userData?.currency_symbol
  const symbolPlacement = userData?.currency_placement

  const price = (price) => {
    if (symbolPlacement === true) {
      return symbol+price.toString()
    } else {
      return price.toString()+symbol
    }
  }

  return useMemo(
    () => ({
      price: price
    }),
    [userData, symbol, symbolPlacement],
  )
}

export default usePrice

import React, { useEffect, useState } from 'react';
import {Keyboard, Platform} from 'react-native';

export default (config = {}) => {
  const { useWillShow = false, useWillHide = false } = config;
  const [keyboardVisible, setVisible] = useState(false);
  const showEvent = useWillShow ? 'keyboardWillShow' : 'keyboardDidShow';
  const hideEvent = useWillHide ? 'keyboardWillHide' : 'keyboardDidHide';

  function dismiss() {
    Keyboard.dismiss();
    setVisible(false);
  }

  const dialogStyles = keyboardVisible ? {maxHeight: Platform.OS === 'ios' ? "55%" : "90%", top: Platform.OS === 'ios' ? "-30%" : "-10%"} : {maxHeight: "90%", top: "-10%"}

  useEffect(() => {
    function onKeyboardShow() {
      setVisible(true);
    }

    function onKeyboardHide() {
      setVisible(false);
    }

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [useWillShow, useWillHide]);

  return {
    keyboardVisible, dismiss, dialogStyles
  };
};

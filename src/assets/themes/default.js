import {black, pinkA400, white} from "react-native-paper/src/styles/colors";
import color from 'color';
import configureFonts from "react-native-paper/src/styles/fonts";

export const theme = {
  dark: true,
  roundness: 4,
  colors: {
    primary: '#BB86FC',
    accent: '#03dac4',
    background: '#292929',
    surface: '#4a4949',
    error: '#B00020',
    text: "#ffffff",
    onSurface: '#fff',
    disabled: color(black).alpha(0.26).rgb().string(),
    placeholder: color(white).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    notification: pinkA400,
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  }
}

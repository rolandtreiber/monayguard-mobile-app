import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {Provider as ReduxProvider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import configureStore from "./configureStore";
import {NavigationContainer} from "@react-navigation/native";
import MainScreen from "./src/views/main-screen";
import Dialogs from "./src/components/dialogs/dialogs";
import {APIProvider} from "./src/context/api-context";
import {createStackNavigator} from "@react-navigation/stack"
import {navigationRef} from "./src/services/root-navigation"
import { Provider as PaperProvider } from 'react-native-paper';
import {theme} from './src/assets/themes/default'
import 'intl';
import 'intl/locale-data/jsonp/en';

const persistentStoreConfig = configureStore();
const Stack = createStackNavigator()

export default function App() {
  return (
    <ReduxProvider store={persistentStoreConfig.store}>
      <PersistGate loading={null} persistor={persistentStoreConfig.persistor}>
        <PaperProvider theme={{
          ...theme
        }}>
          <APIProvider>
            <Dialogs/>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen
                  name={"Navigation"}
                  component={MainScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style="auto"/>
          </APIProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

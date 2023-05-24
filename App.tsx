import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { theme } from "./theme";

const App = () => {
  setBackgroundColorAsync(theme.base);
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
};

export default App;

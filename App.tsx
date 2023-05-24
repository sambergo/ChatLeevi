import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import { StatusBar } from "expo-status-bar";

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
};

export default App;

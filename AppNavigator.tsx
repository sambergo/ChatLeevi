import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import { theme } from "./theme";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.base,
        },
        headerTintColor: "white",
        headerRight: () => (
          <Feather
            name="settings"
            size={24}
            color="white"
            style={{ paddingRight: 20 }}
            onPress={() => navigation.navigate("Settings")}
          />
        ),
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

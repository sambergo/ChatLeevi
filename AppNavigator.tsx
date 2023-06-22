import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import { styles, theme } from "./theme";
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
        headerTintColor: theme.text,
        headerRight: () => (
          <Feather
            name="settings"
            size={24}
            color={theme.text}
            style={{ paddingRight: 20 }}
            onPress={() => navigation.navigate("Settings")}
          />
        ),
      }}
    >
      <Stack.Screen name="ChatLeevi" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

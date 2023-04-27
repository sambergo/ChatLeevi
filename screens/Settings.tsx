import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { theme, styles } from "../theme";

const saveApiKey = async (value: string) => {
  await SecureStore.setItemAsync("apikey", value);
};

export const getSavedKey = async () => {
  let result = await SecureStore.getItemAsync("apikey");
  if (result) {
    return result;
  }
  return null;
};

const Settings = () => {
  const [inputKey, setInputKey] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<string>("");

  useEffect(() => {
    getSavedKey().then((value) => setCurrentKey(value ?? ""));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { marginTop: 24 }]}>OpenAI API key</Text>
      <TextInput
        onChangeText={(text) => setInputKey(text)}
        placeholder="sk-.........."
        style={customStyles.input}
      />
      <View style={customStyles.buttonContainer}>
        <Button
          title="Save key"
          onPress={() => {
            saveApiKey(inputKey);
          }}
          color={theme.FrenchGray}
        />
      </View>
      <Text style={[styles.text, { marginTop: 16 }]}>
        Current key: {currentKey.slice(0, 9)}***************
      </Text>
    </View>
  );
};

export default Settings;

const customStyles = StyleSheet.create({
  input: {
    backgroundColor: theme.Charcoal,
    color: theme.FrenchGray,
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
    width: "80%",
  },
  buttonContainer: {
    backgroundColor: theme.FrenchGray,
    borderColor: theme.BattleshipGray,
    // borderWidth: 1,
    borderRadius: 4,
    marginTop: 16,
    width: "80%",
  },
});

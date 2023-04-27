import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import * as SecureStore from "expo-secure-store";

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
    <View>
      <Text>OpenAI API key</Text>
      <TextInput
        onChangeText={(text) => setInputKey(text)}
        placeholder="sk-.........."
      />
      <Button
        title="Save key"
        onPress={() => {
          saveApiKey(inputKey);
        }}
      />
      <Text>Current key: {currentKey.slice(0, 9)}.............</Text>
    </View>
  );
};

export default Settings;

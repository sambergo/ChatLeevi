import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { styles, theme } from "../theme";

const saveApiKey = async (value: string) => {
  await SecureStore.setItemAsync("apikey", value);
};

export const getSavedKey = async () => {
  return await SecureStore.getItemAsync("apikey");
};

const Settings = () => {
  const [inputKey, setInputKey] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<string>("");

  useEffect(() => {
    getSavedKey().then((value) => setCurrentKey(value ?? ""));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.leevisAnswerText, { marginTop: 24 }]}>
        OpenAI API avain
      </Text>
      <TextInput
        value={inputKey}
        onChangeText={(text) => setInputKey(text)}
        placeholder="sk-.........."
        placeholderTextColor={theme.subtext0}
        style={customStyles.input}
      />
      <View style={customStyles.buttonContainer}>
        <Button
          title="Tallenna"
          disabled={inputKey.length < 20}
          onPress={() => {
            saveApiKey(inputKey)
              .then(() => {
                setCurrentKey(
                  inputKey.slice(0, 3) + "..." + inputKey.slice(-4)
                );
                setInputKey("");
                alert("API key saved successfully!");
              })
              .catch(() => {
                alert("Error saving API key.");
              });
          }}
          color={theme.overlay2}
        />
      </View>
      <Text style={[styles.leevisAnswerText, { marginTop: 16 }]}>
        Nykyinen avain: {currentKey.slice(0, 3) + "..." + currentKey.slice(-4)}
      </Text>
    </View>
  );
};

export default Settings;

const customStyles = StyleSheet.create({
  input: {
    backgroundColor: theme.surface0,
    color: theme.overlay2,
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
    width: "80%",
  },
  buttonContainer: {
    backgroundColor: theme.overlay2,
    borderColor: theme.overlay0,
    borderRadius: 4,
    marginTop: 16,
    width: "80%",
  },
});

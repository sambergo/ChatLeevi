import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles, theme } from "../theme";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export const getSavedKey = async () => {
  return await SecureStore.getItemAsync("apikey");
};

const saveApiKey = async (value: string) => {
  await SecureStore.setItemAsync("apikey", value);
};

const Settings = () => {
  const [inputKey, setInputKey] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<string>("");
  const { i18n } = useTranslation();

  useEffect(() => {
    getSavedKey().then((value) => setCurrentKey(value ?? ""));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.leevisAnswerText, { marginTop: 24 }]}>
        {t("openAiApiKey")}
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
          title={t("buttonSave")}
          disabled={inputKey.length < 20}
          onPress={() => {
            saveApiKey(inputKey)
              .then(() => {
                setCurrentKey(
                  inputKey.slice(0, 3) + "..." + inputKey.slice(-4)
                );
                setInputKey("");
                alert(t("apiKeySaved"));
              })
              .catch(() => {
                alert(t("apiKeyError"));
              });
          }}
          color={theme.overlay2}
        />
      </View>
      <Text style={[styles.leevisAnswerText, { marginTop: 16 }]}>
        {t("currentKey")}:{" "}
        {currentKey.slice(0, 3) + "..." + currentKey.slice(-4)}
      </Text>
      <View style={customStyles.flagContainer}>
        <Pressable onPress={() => i18n.changeLanguage("en")}>
          <Text style={customStyles.flagText}>🇬🇧</Text>
        </Pressable>
        <Pressable onPress={() => i18n.changeLanguage("fi")}>
          <Text style={customStyles.flagText}>🇫🇮</Text>
        </Pressable>
      </View>
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
  flagText: {
    fontSize: 40,
    margin: 25,
  },
  flagContainer: {
    display: "flex",
    flexDirection: "row",
  },
});

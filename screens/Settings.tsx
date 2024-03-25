import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

export const getSavedModel = async () => {
  return await SecureStore.getItemAsync("openaiModule");
};

const saveModel = async (value: string) => {
  await SecureStore.setItemAsync("openaiModule", value);
};

const Settings = () => {
  const [inputKey, setInputKey] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<string>("");
  const [currentModel, setCurrentModel] = useState<string>("");
  const [models, setModels] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    getSavedKey().then((value) => setCurrentKey(value ?? ""));
    getSavedModel().then((value) => setCurrentModel(value ?? ""));
  }, []);

  const selectModel = (module: string) => {
    saveModel(module).then(() => {
      setCurrentModel(module);
      setModalVisible(false);
    });
  };

  async function listOpenAIModels() {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentKey}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();
      const models: string[] = data
        .map((model: any) => model.id)
        .filter((id: string) => id.toLowerCase().startsWith("gpt"));
      setModels(models);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={customStyles.buttonContainer}>
        <Button
          title={`${t("selectModel")} (${currentModel})`}
          onPress={async () => await listOpenAIModels()}
          color={theme.overlay2}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={customStyles.centeredView}>
          <View style={customStyles.modalView}>
            <Text style={customStyles.modalText}>{t("selectModel")}</Text>
            <ScrollView contentContainerStyle={customStyles.cardsContainer}>
              {models.map((model) => (
                <TouchableOpacity
                  key={model}
                  style={customStyles.moduleButton}
                  onPress={() => selectModel(model)}
                >
                  <Text style={customStyles.moduleButtonText}>{model}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Pressable
              style={[customStyles.button, customStyles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={customStyles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
                  inputKey.slice(0, 3) + "..." + inputKey.slice(-4),
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: theme.surface2,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  moduleButton: {
    backgroundColor: theme.sapphire,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  moduleButtonText: {
    color: theme.crust,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: theme.maroon,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    borderRadius: 20,
  },
  textStyle: {
    color: theme.crust,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: theme.sapphire,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

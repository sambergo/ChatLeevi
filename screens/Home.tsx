import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import * as Speech from "expo-speech";
import { t } from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, ToastAndroid, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Loading from "../components/Loading";
import MainCharacter from "../components/MainCharacter";
import i18n from "../i18n";
import { sendToWhisper } from "../services/sendToWhisper";
import { styles, theme } from "../theme";
import { getSavedKey } from "./Settings";

const Home = () => {
  const [recording, setRecording] = useState<Recording | undefined>(undefined);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [leevisAnswer, setLeevisAnswer] = useState<string>(t("welcome"));
  const [waitingGPT, setWaitingGPT] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [selectedPrompt, _setSelectedPrompt] = useState("");

  const [OPENAI_API_KEY, setOpenaiApiKey] = useState<string>("");

  useEffect(() => {
    const fetchSavedKey = async () => {
      const savedKey = await getSavedKey();
      if (savedKey) {
        setOpenaiApiKey(savedKey);
      }
    };
    fetchSavedKey();
  }, []);

  useEffect(() => {
    setLeevisAnswer(t("welcome"));
  }, [i18n.exists("welcome")]);

  i18n.on("languageChanged", () => {
    setLeevisAnswer(t("welcome"));
  });

  const sendToGPT = useCallback(
    async (prompt: string): Promise<any> => {
      if (!OPENAI_API_KEY) {
        console.error("OPENAI API KEY NOT FOUND");
        return null;
      }
      setWaitingGPT(true);
      console.log("prompt", prompt);
      const model = "gpt-3.5-turbo";
      try {
        const URL = "https://api.openai.com/v1/chat/completions";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        };
        const response = await fetch(URL, requestOptions);
        const data = await response.json();
        console.log("data", data);
        const msg = data.choices[0].message.content;
        console.log("msg", msg);
        setLeevisAnswer(msg);
        setWaitingGPT(false);
        setIsSpeaking(true);
        Speech.speak(msg, {
          language: i18n.language,
          onDone: () => setIsSpeaking(false),
        });
        return msg;
      } catch (error) {
        setWaitingGPT(false);
        setIsSpeaking(false);
        console.error(error);
        setLeevisAnswer("ERROR:\n" + error);
        Speech.speak(t("speakError"), { language: i18n.language });
        return null;
      }
    },
    [OPENAI_API_KEY]
  );

  async function handleStartRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function handleStopRecording() {
    if (!recording) {
      return;
    }
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    const { text: whisperText } = await sendToWhisper(uri, OPENAI_API_KEY);
    await handleSend(whisperText);
  }

  async function handleSpeakAnswer() {
    setIsSpeaking(true);
    Speech.speak(leevisAnswer, {
      language: i18n.language,
      onDone: () => setIsSpeaking(false),
    });
  }

  async function handleSend(question: string) {
    console.log("send:", question);
    if (typeof question === "string" && question.length > 2) {
      const gptPrompt = selectedPrompt
        ? selectedPrompt + "\n\n" + question
        : question;
      console.log("gpt-prompt", gptPrompt);
      const gptAnswer = await sendToGPT(gptPrompt);
      console.log("gptAnswer", gptAnswer);
      setUserQuestion("");
    }
  }

  return (
    <View style={styles.container}>
      <MainCharacter />
      {waitingGPT ? (
        <View style={styles.stopRecording}>
          <Loading />
        </View>
      ) : recording ? (
        <View style={styles.stopRecording}>
          <Text style={{ ...styles.text, paddingBottom: 10 }}>
            {t("stopRecording")}
          </Text>
          <FontAwesome5
            name="microphone-slash"
            size={96}
            color={theme.flamingo}
            onPress={handleStopRecording}
          />
        </View>
      ) : (
        <>
          <View style={styles.answerBox}>
            <ScrollView>
              <View>
                {isSpeaking ? (
                  <FontAwesome5
                    name="stop"
                    size={24}
                    color={theme.flamingo}
                    style={styles.volumeUpIcon}
                    onPress={() => {
                      Speech.stop();
                      setIsSpeaking(false);
                    }}
                  />
                ) : (
                  <FontAwesome5
                    name="volume-up"
                    size={24}
                    color={theme.flamingo}
                    style={styles.volumeUpIcon}
                    onPress={handleSpeakAnswer}
                  />
                )}

                <FontAwesome5
                  name="clipboard"
                  size={24}
                  color={theme.flamingo}
                  style={styles.clipboardIcon}
                  onPress={() => {
                    Clipboard.setStringAsync(leevisAnswer);
                    ToastAndroid.show(t("copiedClipboard"), ToastAndroid.SHORT);
                  }}
                />
              </View>
              <Text style={styles.leevisAnswerText}>{leevisAnswer}</Text>
            </ScrollView>
          </View>
          <View style={styles.inputBox}>
            <FontAwesome5
              onPress={recording ? handleStopRecording : handleStartRecording}
              name="microphone"
              size={24}
              color={theme.flamingo}
            />
            <TextInput
              placeholder={t("inputPlaceholder")}
              placeholderTextColor={theme.subtext0}
              value={userQuestion}
              style={styles.inputText}
              onChangeText={(t) => setUserQuestion(t)}
              onSubmitEditing={() => handleSend(userQuestion)}
            ></TextInput>
            <MaterialIcons
              onPress={() => handleSend(userQuestion)}
              name="send"
              size={24}
              color={theme.blue}
            />
          </View>
          {/* <Picker */}
          {/*   style={styles.leevisAnswerText} */}
          {/*   selectedValue={selectedPrompt} */}
          {/*   onValueChange={(itemValue, _itemIndex) => */}
          {/*     setSelectedPrompt(itemValue) */}
          {/*   } */}
          {/* > */}
          {/*   {prompts.map((prompt, i) => ( */}
          {/*     <Picker.Item label={prompt.name} value={prompt.prompt} key={i} /> */}
          {/*   ))} */}
          {/* </Picker> */}
        </>
      )}
    </View>
  );
};

export default Home;

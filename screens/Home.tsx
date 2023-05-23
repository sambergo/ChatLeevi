import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { prompts } from "../prompts";
import { styles, theme } from "../theme";
import { getSavedKey } from "./Settings";

const MainCharacter = () => (
  <View style={styles.mainCharacterContainer}>
    <Image
      source={require("../assets/mj-leevi-nobg.png")}
      style={styles.mainCharacterImage}
    />
  </View>
);

const Home = () => {
  const [recording, setRecording] = useState<Recording | undefined>(undefined);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [leevisAnswer, setLeevisAnswer] = useState<string>(
    "Hau hau, kuinka voin auttaa?"
  );

  const [selectedPrompt, setSelectedPrompt] = useState("");

  const [OPENAI_API_KEY, setOpenaiApiKey] = useState<string>("");

  useEffect(() => {
    const fetchSavedKey = async () => {
      const savedKey = await getSavedKey();
      setOpenaiApiKey(savedKey ?? "");
    };
    fetchSavedKey();
  }, []);

  const sendToWhisper = async (uri: string): Promise<any> => {
    const model = "whisper-1";
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "audio/wav",
      name: "recording.wav",
    });
    formData.append("model", model);
    formData.append("language", "fi");
    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      console.log("data:", data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const sendToGPT = useCallback(
    async (prompt: string): Promise<any> => {
      if (!OPENAI_API_KEY) {
        console.error("OPENAI API KEY NOT FOUND");
        return null;
      }

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
        Speech.speak(msg, { language: "fi" });
        return msg;
      } catch (error) {
        console.error(error);
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
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    const { text: whisperText } = await sendToWhisper(uri);
    await handleSend(whisperText);
  }

  async function handleSpeakAnswer() {
    Speech.speak(leevisAnswer, { language: "fi" });
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
    }
  }

  return (
    <View style={styles.container}>
      <MainCharacter />
      <View style={styles.answerBox}>
        <ScrollView>
          <Text style={styles.leevisAnswerText}>{leevisAnswer}</Text>
          <FontAwesome5
            name="volume-up"
            size={24}
            color={theme.flamingo}
            style={styles.volumeUpIcon}
            onPress={handleSpeakAnswer}
          />
        </ScrollView>
      </View>
      <View>
        <View style={styles.inputBox}>
          <FontAwesome5
            onPress={recording ? handleStopRecording : handleStartRecording}
            name="microphone"
            size={24}
            color={theme.flamingo}
          />
          <TextInput
            placeholder="Kirjoita kysymys tai nauhoita"
            placeholderTextColor={theme.text}
            value={userQuestion}
            style={styles.inputText}
            onChangeText={(t) => setUserQuestion(t)}
          ></TextInput>
          <MaterialIcons
            onPress={async () => {
              setUserQuestion("");
              await handleSend(userQuestion);
            }}
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
      </View>
    </View>
  );
};

export default Home;

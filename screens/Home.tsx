import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
import { styles, theme } from "../theme";
import { getSavedKey } from "./Settings";

const MainCharacter = () => (
  <View style={styles.mainCharacterContainer}>
    <Image
      source={require("../assets/academic-leevi-transformed.png")}
      style={styles.mainCharacterImage}
    />
  </View>
);

const Home = () => {
  const [recording, setRecording] = useState<Recording | undefined>(undefined);
  const [leevisAnswer, setLeevisAnswer] = useState<string | null>(null);
  const [OPENAI_API_KEY, setOpenaiApiKey] = useState<string>("");

  useEffect(() => {
    const fetchSavedKey = async () => {
      const savedKey = await getSavedKey();
      setOpenaiApiKey(savedKey ?? null);
    };
    fetchSavedKey();
  }, []);

  const sendToWhisper = async (uri: string) => {
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
    async (prompt: string) => {
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

  async function startRecording() {
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

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    const { text } = await sendToWhisper(uri);
    console.log("text:", text);
    if (typeof text === "string" || text.length <= 4) {
      const gptAnswer = await sendToGPT(text);
      console.log("gptAnswer", gptAnswer);
    }
  }

  return (
    <View style={styles.container}>
      <MainCharacter />
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={styles.text}>{leevisAnswer}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ flex: 1 }} />
        <View style={styles.button}>
          <Button
            title={recording ? "Lopeta nauhoitus" : "Nauhoita kysymys"}
            onPress={recording ? stopRecording : startRecording}
            color={theme.Charcoal}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};

export default Home;

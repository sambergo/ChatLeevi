import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { getSavedKey } from "./Settings";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [recording, setRecording] = useState<Recording | undefined>(undefined);
  const [leevisAnswer, setLeevisAnswer] = useState("");
  const [OPENAI_API_KEY, setOpenaiApiKey] = useState<string | null>(null);

  const navigation = useNavigation();

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

  const sendToGPT = async (prompt: string) => {
    if (!OPENAI_API_KEY) {
      console.error("NO OPENAI API KEY");
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
  };

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
    const gptAnswer = await sendToGPT(text);
    console.log("gptAnswer", gptAnswer);
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name="settings-outline"
        size={24}
        color="black"
        onPress={() => navigation.navigate("Settings")}
        style={{ position: "absolute", top: 0, right: 0, margin: 16 }}
      />
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text>{leevisAnswer}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1, marginBottom: 16 }}>
          <Button
            title={recording ? "Stop Recording" : "Start Recording"}
            onPress={recording ? stopRecording : startRecording}
          />
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});

export default Home;

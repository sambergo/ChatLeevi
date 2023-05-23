import React from "react";
import { View, TextInput } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { styles, theme } from "../theme";

const ChatInputBox = () => {
  return (
    <View style={styles.inputBox}>
      <FontAwesome5 name="microphone" size={24} color={theme.flamingo} />
      <TextInput
        placeholder="Kirjoita kysymys tai nauhoita"
        placeholderTextColor={theme.text}
        style={styles.inputText}
      ></TextInput>
      <MaterialIcons name="send" size={24} color={theme.blue} />
    </View>
  );
};

export default ChatInputBox;

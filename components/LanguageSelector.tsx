import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <View>
      <Pressable onPress={() => changeLanguage("en")}>
        <Text>🇬🇧</Text>
      </Pressable>
      <Pressable onPress={() => changeLanguage("fi")}>
        <Text>🇫🇮</Text>
      </Pressable>
    </View>
  );
};

export default LanguageSelector;

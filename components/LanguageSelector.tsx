import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t("language")}</Text>
      <View style={styles.flagContainer}>
        <Pressable
          onPress={() => i18n.changeLanguage("en")}
          style={styles.flag}
        >
          <Text style={styles.flagText}>🇬🇧</Text>
        </Pressable>
        <Pressable
          onPress={() => i18n.changeLanguage("fi")}
          style={styles.flag}
        >
          <Text style={styles.flagText}>🇫🇮</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  flagContainer: {
    display: "flex",
    flexDirection: "row",
  },
  flag: {
    marginRight: 10,
  },
  flagText: {
    fontSize: 30,
  },
});

export default LanguageSelector;

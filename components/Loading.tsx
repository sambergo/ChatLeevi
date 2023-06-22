import React from "react";
import { Animated, Easing, Text, View } from "react-native";
import { styles } from "../theme";
import { t } from "i18next";

const Loading = () => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.text}>{t("loadingText")}</Text>
      <Animated.View
        style={[styles.spinner, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

export default Loading;

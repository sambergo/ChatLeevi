import { StyleSheet } from "react-native";

export const theme = {
  BattleshipGray: "#888D90",
  RichBlack: "#252a34",
  RichBlack2: "#6b747c",
  FrenchGray: "#AFB2B5",
  Charcoal: "#2F3C46",
  NearWhite: "#F2F2F2",
};
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.RichBlack,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  mainCharacterContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    maxHeight: "35%",
    width: "100%",
    // marginTop: "5%",
  },
  mainCharacterImage: {
    resizeMode: "contain",
    height: "100%",
    width: "90%",
  },
  answerBox: {
    borderWidth: 2,
    borderColor: theme.Charcoal,
    borderRadius: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  text: {
    color: theme.NearWhite,
    marginBottom: 16,
    padding: 8,
    minWidth: "90%",
    maxWidth: "90%",
    minHeight: "20%",
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    margin: 16,
    backgroundColor: theme.FrenchGray,
    borderColor: theme.BattleshipGray,
    borderRadius: 8,
    padding: 16,
  },
  buttonText: {
    color: theme.RichBlack2,
    textAlign: "center",
  },
  icon: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 16,
    color: theme.BattleshipGray,
  },
});

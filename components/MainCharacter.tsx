import { Image, View } from "react-native";
import { styles } from "../theme";

const MainCharacter = () => (
  <View style={styles.mainCharacterContainer}>
    <Image
      source={require("../assets/mj-leevi-nobg.png")}
      style={styles.mainCharacterImage}
    />
  </View>
);

export default MainCharacter;

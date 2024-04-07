import {View, Text, StyleSheet} from "react-native";
import { useIsConnected } from "./firebase";

export const DeviceStatus = () => {
  const isAConnected = useIsConnected("board_a");
  const isBConnected = useIsConnected("board_b");
  return (
    <View
      style={styles.container}>
    <View style={styles.a}>
      <Text>
      Device A: {isAConnected ? "Online" : "Offline"}
      </Text>
    </View>
    <View style={styles.b}>
      <Text>
      Device B: {isBConnected ? "Online" : "Offline"}
      </Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  a: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 2,
    borderRightWidth: 1,
    borderColor: "red",
  }, 
  b: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 2,
    borderLeftWidth: 1,
    borderColor: "blue",
  },
});

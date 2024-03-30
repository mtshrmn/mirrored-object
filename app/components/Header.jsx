import { StyleSheet, View, Text, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useLastConnected, useCurrentState } from "../firebase.js";

const screenWidth = Dimensions.get('window').width;
const iconFlexRatio = 0.15; // Adjust the flex ratio for icons
const textContainerFlexRatio = 0.85; // Adjust the flex ratio for text container

// Function to determine the color based on connection delta
const connectionDeltaToColor = (delta) => delta < 2 ? "green" : delta < 10 ? "yellow" : "red";

const Header = ({
  states,
}) => {
  // Fetch the last connected timestamps for each cube
  const lastConnectedA = useLastConnected("cube_a");
  const lastConnectedB = useLastConnected("cube_b");
  const currentStateA = useCurrentState("cube_a"); // Fetch the current state for cube_a
  const currentStateB = useCurrentState("cube_b"); // Fetch the current state for cube_b

  
  // Calculate the delta in seconds since last connection for each cube
  const calculateDelta = (lastConnectedTimestamp) => {
    const now = Date.now() / 1000; // Current time in epoch seconds
    return now - lastConnectedTimestamp; // Delta in seconds
  };

  const deltaA = calculateDelta(lastConnectedA);
  const deltaB = calculateDelta(lastConnectedB);

  // Determine the color for each icon based on the delta
  const statusA = connectionDeltaToColor(deltaA);
  const statusB = connectionDeltaToColor(deltaB);

  return (
    <View style={styles.head}>
      <View style={{ flexDirection: 'row' }}>
        {/* Cube A */}
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
          <Icon style={{ flex: iconFlexRatio, marginRight: -40 }} size={24} color={statusA} name='globe' />
          <View style={{ flex: textContainerFlexRatio, justifyContent: 'center', flexDirection: 'column' }}>
            <Text style={styles.text}>cube a</Text>
            {statusA !== "red" && <Text style={styles.state_text}>{states[currentStateA]}</Text>}
          </View>
        </View>
        {/* Cube B */}
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
          <Icon style={{ flex: iconFlexRatio, marginRight: -40}} size={24} color={statusB} name='globe' />
          <View style={{ flex: textContainerFlexRatio, justifyContent: 'center', flexDirection: 'column' }}>
            <Text style={styles.text}>cube b</Text>
            {statusB !== "red" && <Text style={styles.state_text}>{states[currentStateB]}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  head: {
    padding: screenWidth * 0.05, // Dynamic padding based on screen width
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: screenWidth * 0.04, // Dynamic font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  state_text: {
    color: 'white',
    fontSize: screenWidth * 0.03, // Smaller dynamic font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Header;

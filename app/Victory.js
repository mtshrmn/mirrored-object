import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useHistory} from "./firebase";
import { VictoryAxis, VictoryArea, VictoryChart, VictoryTheme, VictoryZoomContainer } from 'victory-native';

export default function App() {
  const history = useHistory("cube_a");
  const parseEpoch = epoch => {
    const date = new Date(epoch * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${day}/${month}:${hour}:${minute}`;
  }
  const data = Object.entries(history).map(([key, val]) => ({"time": parseInt(key), "state": val}));

  return (
    <View style={styles.container}>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        containerComponent={<VictoryZoomContainer/>}
      >
        <VictoryAxis
          tickFormat={(t) => parseEpoch(t)} // Use parseEpoch to format ticks
          fixLabelOverlap={true} // Optional: Helps prevent label overlap
        />
        <VictoryAxis
          dependentAxis // This prop specifies that this is the y-axis
          tickFormat={(t) => `${t}`} // Optional formatting, customize as needed
          style={{
            axisLabel: { padding: 30 } // Adjust label positioning if necessary
          }}
        />
        <VictoryArea
          data={data}
          x="time"
          y="state"
          style={{ data: { fill: "#c43a31" } }}
        />
      </VictoryChart>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



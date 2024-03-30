import React, {useEffect, useState} from "react";
import { View, StyleSheet } from 'react-native';
import { useHistory } from "../firebase";
import { VictoryAxis, VictoryArea, VictoryChart, VictoryTheme, VictoryZoomContainer, VictoryLabel, VictoryLine, VictoryBar, VictoryStep } from 'victory-native';

const Graph = ({ cube, states, graphType }) => {
  const history = useHistory(cube);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (!history || !history["state_and_time"]) return; // Exit if history or state_and_time is undefined

    // Simulate fetching 'history' and transforming it
    const historyData = Object.entries(history["state_and_time"]).map(([key, val]) => ({
      state: val.state,
      timeStamp: val.timeStamp,
    }));
  
    const barData = aggregateStateOccurrences(historyData);
  
    setGraphData(barData); // Assuming you use `graphData` directly for the bar graph
  }, [cube, history]);
  
  
  // Parses epoch time to a more readable format
  const parseEpoch = epoch => {
    const date = new Date(epoch * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}:${date.getHours()}:${date.getMinutes()}`;
  };

  // Transforms history data into a suitable format for the graph
  const data = Object.entries(history).map(([key, val]) => ({ "time": parseInt(key), "state": val }));
  
  const aggregateStateOccurrences = (historyData) => {
    const stateCounts = historyData.reduce((acc, { state }) => {
      // Increment the count for this state
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});
  
    // Convert the aggregated data into an array suitable for VictoryBar
    const barData = Object.entries(stateCounts).map(([state, count]) => ({
      // Assuming `states` is an object mapping state IDs to labels
      x: states[state] ? states[state] : `State ${state}`,
      y: count,
    }));
  
    return barData;
  };
  
  // Defines a dictionary for state values

  // Function to wrap text based on max characters per line
  const wrapText = (text, maxChar) => {
    if (typeof text !== 'string') {
      console.warn('wrapText received non-string input:', text);
      return 'Unknown State'; // Or return a default string value to indicate the issue
    }

    let result = [];
    let currentLine = [];

    text.split(' ').forEach(word => {
      if ((currentLine.join(' ') + word).length + 1 > maxChar) {
        result.push(currentLine.join(' '));
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });

    if (currentLine.length) {
      result.push(currentLine.join(' '));
    }

    return result.join('\n'); // Join the lines with newline character
  };
  let GraphComponent;
  switch (graphType) {
    case 'line':
      GraphComponent = <VictoryLine data={data} x="time" y="state" style={{ data: { stroke: "#43A6C6" } }} />;
      break;
    case 'area':
      GraphComponent = <VictoryArea data={data} x="time" y="state" style={{ data: { fill: "green" } }} />;
      break;
      case 'bar':
        GraphComponent = <VictoryBar data={graphData} style={{ data: { fill: "orange" } }} />;
        break;
    default:
      GraphComponent = <VictoryArea data={data} x="time" y="state" style={{ data: { fill: "green" } }} />;
  }
  

  let xAxisTickFormat;
  let yAxisTickFormat;
  if (graphType === 'bar') {
    // For bar graphs, use the x values (state labels) directly
    xAxisTickFormat = (x) => x;
    yAxisTickFormat = (y) => y;
  } else {
    // For other graph types, adjust accordingly (e.g., parseEpoch for time-based graphs)
    xAxisTickFormat = (t) => parseEpoch(t);
    yAxisTickFormat = (t) => wrapText(states[t], 10);
  }

  return (
    <View style={styles.container}>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10} containerComponent={<VictoryZoomContainer />} padding={{ left: 80, top: 50, right: 30, bottom: 50 }}>
        <VictoryAxis tickFormat={xAxisTickFormat} fixLabelOverlap={true} style={{ tickLabels: { fill: "white", fontSize: 12, padding: 5 }}}/>
        <VictoryAxis dependentAxis tickFormat={yAxisTickFormat} tickLabelComponent={<VictoryLabel dx={-5} textAnchor="end" />} style={{ tickLabels: { fill: "white", fontSize: 12, fontWeight: 'bold', padding: 5 }}}/>
        {GraphComponent}
      </VictoryChart>
    </View>
  );
}

export default Graph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

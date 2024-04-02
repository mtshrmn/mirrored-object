import React, {useEffect, useState} from "react";
import { View, StyleSheet,Text } from 'react-native';
import { useHistory } from "../firebase";
import { VictoryAxis, VictoryArea, VictoryChart, VictoryTheme, VictoryZoomContainer, VictoryLabel, VictoryLine, VictoryBar, VictoryStep } from 'victory-native';

const Graph = ({ cube, states, graphType }) => {
  const history = useHistory(cube);
  const [graphData, setGraphData] = useState([]);
  const [currentZoomDomain, setCurrentZoomDomain] = useState({x: [0,0]})
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);


  useEffect(() => {
    if (!history) return; // Exit if history or state_and_time is undefined

    // Simulate fetching 'history' and transforming it
    const historyData = Object.entries(history).map(([key, val]) => ({
      state: val,
      timeStamp: parseInt(key),
    }));
    const timeValues = Object.keys(history).map(key => parseInt(key, 10)).filter(time => !isNaN(time) && time!==0);
    const minTime = Math.min(...timeValues);
    const maxTime = Math.max(...timeValues);
    console.log(minTime, maxTime)
    setMinTime(minTime);
    setMaxTime(maxTime);

    const barData = aggregateStateOccurrences(historyData);
  
    setGraphData(barData); // Assuming you use `graphData` directly for the bar graph
    setCurrentZoomDomain({ x: [minTime, maxTime] }); 
  }, [cube, history]);
  
  
  // Parses epoch time to a more readable format
  const parseEpoch = epoch => {
    const date = new Date(epoch * 1000);
    // Format: "dd/mm | hr:min"
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Transforms history data into a suitable format for the graph
  const data = Object.entries(history).map(([key, val]) => ({ "time": (key), "state": val }));
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
      return; 
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
      GraphComponent = <VictoryLine data={data} x="time" y="state" style={{ data: { stroke: "#43A6C6" } }} />;
  }
  

  let xAxisTickFormat;
  let yAxisTickFormat;
  if (graphType === 'bar') {
    // For bar graphs, use the x values (state labels) directly
    xAxisTickFormat = (x) => x;
    yAxisTickFormat = (y) => y;
  } else {
    // For other graph types, adjust accordingly (e.g., parseEpoch for time-based graphs)
    xAxisTickFormat = (t) => parseEpoch(t); //
    yAxisTickFormat = (t) => wrapText(states[t], 10);
  }

  const handleZoomDomainChange = (newDomain) => {
    const adjustedDomain = {
      x: [
        Math.max(newDomain.x[0], minTime),
        newDomain.x[1] // Allows panning to the right without changing the max constraint here
      ]
    };
  
    setCurrentZoomDomain(adjustedDomain);
  };
  
  return (
    data.length > 0 ? (
      <View style={styles.container}>
        <VictoryChart theme={VictoryTheme.material} onZoomDomainChange={handleZoomDomainChange} zoomDomain={currentZoomDomain}
         domainPadding={10} containerComponent={<VictoryZoomContainer minimumZoom={{x:5}} zoomDimension="x" />} 
         padding={{ left: 80, top: 5, right: 30, bottom: 90 }}>
          <VictoryAxis tickFormat={xAxisTickFormat} fixLabelOverlap={true} style={{ tickLabels: { fill: "white", fontSize: 12, padding: 5 }}} tickLabelComponent={
              <VictoryLabel
                angle={-45}
                textAnchor="end"
                verticalAnchor="middle"
                dx={-10}
                dy={10} // Adjustments to position the label correctly
              />
            }/>
          <VictoryAxis dependentAxis tickFormat={yAxisTickFormat} tickLabelComponent={<VictoryLabel dx={-5} textAnchor="end" />} style={{ tickLabels: { fill: "white", fontSize: 12, fontWeight: 'bold', padding: 5 }}}/>
          {GraphComponent}
        </VictoryChart>
      </View>
    ) : (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: 'white'}}>Fetching the data...</Text>
      </View>
    )
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

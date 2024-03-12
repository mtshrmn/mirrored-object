import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import React ,{ useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from 'react-native';
 //data will be an array, and in each object there will be x,y pair as such[{x1,y1},{x2,y2},{x:3,y:3}]
 const Graph = ({ 
  data,
  type,

}) => {
  const [graphType, setGraphType] = useState('LineChart');
  const [labels, setLabels] = useState([]);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    setGraphType(type);
    if (Object.keys(data).length) {
      initiateDataAndLabels();
    }
  }, [type, data]);

  const generateEquallySpacedLabels = (startTime, endTime, numberOfLabels) => {
    const totalRange = endTime - startTime;
    const interval = totalRange / (numberOfLabels - 1);

    let labels = [];
    for (let i = 0; i < numberOfLabels; i++) {
      const timestamp = new Date((startTime + i * interval) * 1000);
      labels.push(`${timestamp.getHours()}:${timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes()}`);
    }
    return labels;
  };

  const interpolateMissingData = (sortedEpochTimes, data) => {
    const intervalInSeconds = (sortedEpochTimes[sortedEpochTimes.length - 1] - sortedEpochTimes[0]) / (5);
    let newData = [];
    let previousValue = data[sortedEpochTimes[0]];

    sortedEpochTimes.forEach((time, index) => {
      if (index > 0) {
        let gap = time - sortedEpochTimes[index - 1];
        let steps = gap / intervalInSeconds;
        for (let step = 1; step < steps; step++) {
          newData.push(previousValue); // Push the same value to indicate no change
        }
      }
      newData.push(data[time]);
      previousValue = data[time];
    });

    return newData;
  };

  function initiateDataAndLabels() {
    const sortedEpochTimes = Object.keys(data).map(Number).sort((a, b) => a - b);

    const newLabels = generateEquallySpacedLabels(sortedEpochTimes[0], sortedEpochTimes[sortedEpochTimes.length - 1], 6);
    const interpolatedData = interpolateMissingData(sortedEpochTimes, data);

    setLabels(newLabels);
    setDataset(interpolatedData);
  };

  const chartProps = {
    width: (Dimensions.get("window").width) * 19 / 20,
    height: 220,
    chartConfig: {
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
    },
    bezier: true,
    style: {
      marginVertical: 8,
      borderRadius: 16
    }
  };

  const renderChart = () => {
    const commonData = {
      labels,
      datasets: [{
        data: dataset
      }]
    };

    switch (graphType) {
      case 'LineChart':
        return <LineChart {...chartProps} data={commonData} />;
      case 'BarChart':
        return <BarChart {...chartProps} data={commonData} />;
      case 'PieChart':
        // PieChart might require different data structure
        return <PieChart {...chartProps} data={data} />;
      case 'ProgressChart':
        // ProgressChart might require different props
        return <ProgressChart {...chartProps} data={data} />;
      default:
        return <LineChart {...chartProps} data={commonData} />;
    }
  };

  return (
    <View>
      {renderChart()}
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

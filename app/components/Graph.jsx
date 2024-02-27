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
  const [labels, setLabels] = useState(Array.apply(null, Array(6)).map(function (x,i) {return i}));
  useEffect(() => {
    setGraphType(type);
    initiateLabelData();
    //need to add checks and data about pie charts and progress charts

  }, [type]);

  const initiateLabelData = () => {
    const start = data[0].x;
    const end = data[data.length - 1].x;
    const delta = (end - start) / 6;
    const newLabels = Array.apply(null, Array(6)).map(function (x,i) {return i});
    for (let i = 0; i < 6; i++) {
      newLabels[i] = Math.round(start + i * delta);
    }
    setLabels(newLabels);
  }

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
        data: data.map((item) => item.y)
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

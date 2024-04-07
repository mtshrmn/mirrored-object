import {View, Dimensions} from "react-native";
import {LineChart} from "react-native-chart-kit";

const chartProps = {
    getDotColor: (datapoint, a) => {
      if (datapoint === 0) {
        return 'transparent';
      }
      return 'white';
    },
    width: (Dimensions.get("window").width) * 19 / 20,
    height: 220,
    withDots: false,
    chartConfig: {
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

export const Chart = ({labels, dataA, dataB}) => {
  const commonData = {
    labels,
    datasets: [
      { data: dataA, color: () => "red" },
      { data: dataB, color: () => "blue" },
    ]
  };
  
  return (
    <View>
      <LineChart data={commonData} {...chartProps} />
    </View>
  );
};

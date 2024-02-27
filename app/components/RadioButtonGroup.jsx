import * as React from 'react';
import { View, Text, StyleSheet, useAnimatedValue } from 'react-native';
import { RadioButton } from 'react-native-paper';

const RadioButtonGroup = ({
  onChangeSelectedItem,
  selectedGraphType,
}) => {
  const options = [
    { value: 'LineChart', label: 'Line' },
    { value: 'BarChart', label: 'Bar' },
    { value: 'PieChart', label: 'Pie' },
    { value: 'ProgressChart', label: 'Progress' },
  ];
  // Define your options here 

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <View key={option.value} style={styles.radioButtonContainer}>
          <RadioButton
            value={option.value}
            status={selectedGraphType === option.value ? 'checked' : 'unchecked'}
            onPress={() => {
              onChangeSelectedItem(option.value)
            }}
            color="blue"
          />
          <Text style={{ color: 'white' }}>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default RadioButtonGroup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

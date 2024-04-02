import * as React from 'react';
import { View, Text, StyleSheet, useAnimatedValue } from 'react-native';
import { RadioButton } from 'react-native-paper';

const RadioButtonGroup = ({
  onChangeSelectedItem,
  selectedCubeType,
}) => {
  const options = [
    { value: 'cube_a', label: 'Cube A' },
    { value: 'cube_b', label: 'Cube B' },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <View key={option.value} style={[styles.radioButtonContainer, option.value==='cube_b' ? styles.additionalPadding : {}]}>
          <RadioButton
            value={option.value}
            status={selectedCubeType === option.value ? 'checked' : 'unchecked'}
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
  additionalPadding: {
    paddingRight: 25,
  },
});

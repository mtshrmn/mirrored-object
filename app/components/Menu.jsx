import React, { useState } from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Menu = ({
  onChangeSelectedItem,
  }
) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onChangeSelectedItem(item);
  };

  const menuItems = [{label: 'line graph', value: 'line'}, {label: 'area graph', value: 'area'}, {label: 'bar graph', value: 'bar'}];

  return (
    <View style={styles.container}>
      <RNPickerSelect style={pickerSelectStyles} 
      placeholder={{label: 'selecet an option', value: null}}
      darkTheme={true}
      pickerProps={{style: {color: 'white'}}}
      items={menuItems}
      onValueChange={handleItemClick}
      value={selectedItem}
      useNativeAndroidPickerStyle={false} // Important for applying custom styles on Android
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    opacity: 1,
    alignItems: 'center', // Align items in the center vertically
    justifyContent: 'center', // Center the content horizontally
  },

  text: {
    color: 'white',
    fontSize: 20,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowRadius: 10,
    textShadowOffset: {width: 1, height: 1},
  },

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray', 
    borderRadius: 10,
    backgroundColor: 'white', 
    color: 'black', 
    width: (Dimensions.get("window").width)*19/20,
    height: (Dimensions.get("window").height)*3/40,
    textAlign: 'center',
  },
  inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: 'white',
      textShadowColor: 'black',
      textShadowRadius: 10,
      textShadowOffset: {width: 1, height: 1},
  },
  iconContainer: {
    top: '50%',
    right: 15,
    transform: [{ translateY: -10 }],
  },
});

export default Menu;

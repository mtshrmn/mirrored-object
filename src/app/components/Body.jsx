import {StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Graph from './Graph';
import RadioButtonGroup from './RadioButtonGroup';
import Menu from './Menu';


const Body = ({
  states,
}) => {
  const [cube, setCube] = useState('cube_a');
  const [graphType, setGraphType] = useState('line');

  const selectedCubeHandler = (item) => {
    setCube(item);
  };
  const selectedGraphTypeHandler = (item) => {
    setGraphType(item);
  }


  return(
    <View style={styles.body}>
      <View style={{flex:1}}> 
        <Menu onChangeSelectedItem={selectedGraphTypeHandler}/>
        <RadioButtonGroup onChangeSelectedItem={selectedCubeHandler} selectedCubeType={cube} />
      </View>
      <View style={{flex:1}}>     
      </View>
      <View style={{flex:9}}>
        <Graph key={cube} states={states} cube={cube} graphType={graphType}/>
      </View>
    </View>
  )
}

export default Body;

const styles = StyleSheet.create({
  body: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
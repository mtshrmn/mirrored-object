import {StyleSheet, View } from 'react-native';
import Menu from './Menu';
import Button from './Button';
import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import RadioButtonGroup from './RadioButtonGroup';

const Body = ({
  selectedTimeIntervalHandler,
  menuTimes,
  selectedGraphType,
  selectedGraphTypeHandler,
  buttonPressedHandler,
  graphType,
}) => {

  return(
    <View style={styles.body}>
      <View style={{flex:1}}> 
        <Menu onChangeSelectedItem = {selectedTimeIntervalHandler} menuItems={menuTimes}/>
        <RadioButtonGroup selectedGraphType={selectedGraphType} onChangeSelectedItem={selectedGraphTypeHandler}/>
      </View>
      <View style={{flex:1}}>     
        <Button title ='Generate!' onClick={()=>buttonPressedHandler()}/> 
      </View>
      <View style={{flex:4}}>
        <Graph data={[{x:1,y:2},{x:2,y:4},{x:3,y:5},{x:4,y:2},{x:5,y:16},{x:6,y:3},{x:7,y:8},{x:8,y:8},]} type={graphType}/>
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
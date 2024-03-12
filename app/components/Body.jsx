import {StyleSheet, View } from 'react-native';
import Menu from './Menu';
import Button from './Button';
import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import RadioButtonGroup from './RadioButtonGroup';
import { getPresses } from '../firebase';
import { set } from 'firebase/database';

const Body = ({
  selectedGraphType,
  selectedGraphTypeHandler,
  buttonPressedHandler,
  graphType,
  generate,
  setSelectedBoard,
}) => {
  const [presses, setPresses] = useState({});
  const [board, setBoard] = useState('board_a');

  useEffect(() => {
    getPresses(board, setPresses);
  }, [generate,board]);

  const boardMenu = [{label: 'board a', value: 'board_a'}, {label: 'board b', value: 'board_b'}];

  const selectedBoardHandler = (item) => {
    setBoard(item);
    setSelectedBoard(item);
    if (Object.keys(presses).length==0) {
      return;
    }
  };


  return(
    <View style={styles.body}>
      <View style={{flex:1}}> 
        <Menu onChangeSelectedItem = {selectedBoardHandler} menuItems={boardMenu}/>
        <RadioButtonGroup selectedGraphType={selectedGraphType} onChangeSelectedItem={selectedGraphTypeHandler}/>
      </View>
      <View style={{flex:1}}>     
        <Button title ='Generate!' onClick={()=>buttonPressedHandler()}/> 
      </View>
      <View style={{flex:4}}>
        <Graph data={presses} type={graphType}/>
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
import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useConnectedDelta} from "../firebase.js";

const connectionDeltaToColor = delta => delta < 2 ? "green" : delta < 4 ? "yellow" : "red";

const Header =({

}) =>{
  const connectedDeltaA = useConnectedDelta("board_a");
  const connectedDeltaB = useConnectedDelta("board_b");
  const statusA = connectionDeltaToColor(connectedDeltaA);
  const statusB = connectionDeltaToColor(connectedDeltaB);
  return (
    <View style={styles.head}>
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1 , justifyContent:'center', flexDirection:'row'}}>          
          <Icon style={{backgroundColor:'black', flex:0.18}} size={24} color={statusA} name='rss'/>
          <Text style={styles.text}>board-a</Text>
        </View>
        <View style={{flex:1 , justifyContent:'center', flexDirection:'row'}}>          
          <Icon style={{backgroundColor:'black', flex:0.18}} size={24} color={statusB} name='rss'/>
          <Text style={styles.text}>board-b</Text>
        </View>        
      </View>
    </View> 


  )
}

export default Header;

const styles = StyleSheet.create({
  head: {
    padding: 30,
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

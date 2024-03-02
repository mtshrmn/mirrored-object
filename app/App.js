import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {react, useState, useEffect} from "react";
import {boardTest} from "./firebase";
import {onValue, ref} from "firebase/database";

import { ImageBackground, ToastAndroid, Platform, Alert, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Body from './components/Body';
>>>>>>> master

export default function App() {
<<<<<<< HEAD
  const presses = usePresses("board_test");
||||||| 24db184
  const [lastConnected, setLastConnected] = useState('-1');

  useEffect(() => {
    onValue(boardTest, (snapshot) => {
    const epochMs = snapshot.val();
        const humanDate = new Date(epochMs * 1000);
        setLastConnected(humanDate.toString());
    });
  }, []);
=======
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(null);
  const [selectedGraphType, setSelectedGraphType] = useState('LineChart');
  const [buttonPressed, setButtonPressed] = useState(false);
  const [renderGraph, setRenderGraph] = useState(false);
  const[graphType, setGraphType] = useState(null);

  useEffect(() => {
    if(buttonPressed){
      if (!(selectedTimeInterval)) {
        notifyMessage('No graph time interval selected');
        setButtonPressed(false);
        return;
      }
      renderNewGraph();
      console.log('Button pressed and the selected item is:', selectedTimeInterval);
      setButtonPressed(false);
    };
  }, [buttonPressed]);

  useEffect(() => {
    setGraphType(selectedGraphType);
  }, [renderGraph]);

  const menuTimes = [{label: 'hourly', value: 'hourly'}, {label: 'daily', value: 'daily'},
  {label: 'Monthly', value: 'Monthly'}, {label: 'Yearly', value: 'Yearly'}];

  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }

  const selectedTimeIntervalHandler = (item) => {
    setSelectedTimeInterval(item);
  };

  const selectedGraphTypeHandler = (item) => {
    if (item == 'ProgressChart' || item == 'PieChart') {
      notifyMessage('This graph type is not supported yet');
      setSelectedGraphType('LineChart');
    }
    else{
      setSelectedGraphType(item);
    }
  }

  const renderNewGraph = () => {
    console.log('rendering new graph with type:', selectedGraphType);
    setRenderGraph(!renderGraph);
  };

  const buttonPressedHandler = () => {
    setButtonPressed(true);
    if (!selectedTimeInterval) {
      return;
    }
  }
>>>>>>> master

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <Text>total presses {JSON.stringify(presses)}</Text>
      <StatusBar style="auto" />
    </View>
||||||| 24db184
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>last: {lastConnected}</Text>
      <StatusBar style="auto" />
    </View>
=======
        <View>
          <ImageBackground source={require('./assets/download.png')} style={styles.image}>
             <Header/>
             <Body selectedTimeIntervalHandler={selectedTimeIntervalHandler} menuTimes={menuTimes}
              selectedGraphType={selectedGraphType} selectedGraphTypeHandler={selectedGraphTypeHandler}
              buttonPressedHandler={buttonPressedHandler} graphType={graphType}/>
            </ImageBackground>
          </View>
>>>>>>> master
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', },
||||||| 24db184
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
=======
  image: {
    width: '100%',
    height: '100%',
    opacity: '0.7',
  },
>>>>>>> master
});

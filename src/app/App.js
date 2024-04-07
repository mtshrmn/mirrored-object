import { ImageBackground, ToastAndroid, Platform, Alert, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Body from './components/Body';

export default function App() {
 
  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }


  const states = {
    1: 'available',
    2: 'on a break',
    3: 'emergency only',
    4: 'in a meeting',
    // 5: 'on a break',
    // 6: 'in a meeting',
  };

  return (
        <View>
          <ImageBackground source={require('./assets/download.png')} style={styles.image}>
             <Header states={states}/>
             <Body states={states}/>
            </ImageBackground>
          </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    },
});

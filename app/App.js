import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {react, useState, useEffect} from "react";
import {boardTest} from "./firebase";
import {onValue, ref} from "firebase/database";


export default function App() {
  const [lastConnected, setLastConnected] = useState('-1');

  useEffect(() => {
    onValue(boardTest, (snapshot) => {
    const epochMs = snapshot.val();
        const humanDate = new Date(epochMs * 1000);
        setLastConnected(humanDate.toString());
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>last: {lastConnected}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

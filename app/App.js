import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {react, useState, useEffect} from "react";
import {usePresses} from "./firebase";

export default function App() {
  const presses = usePresses("board_test");

  return (
    <View style={styles.container}>
      <Text>total presses {JSON.stringify(presses)}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', },
});

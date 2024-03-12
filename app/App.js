import { ImageBackground, ToastAndroid, Platform, Alert, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Body from './components/Body';

export default function App() {
  const [selectedGraphType, setSelectedGraphType] = useState('LineChart');
  const [buttonPressed, setButtonPressed] = useState(false);
  const [renderGraph, setRenderGraph] = useState(false);
  const[graphType, setGraphType] = useState(null);
  const [generate, setGenerate] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
 
  useEffect(() => {
    if(buttonPressed){
      if (!(selectedBoard)) {
        notifyMessage('No board selected');
        setButtonPressed(false);
        return;
      }
      renderNewGraph();
      console.log('Button pressed and the selected item is:', selectedBoard);
      setButtonPressed(false);
    };
  }, [buttonPressed]);

  useEffect(() => {
    setGraphType(selectedGraphType);
  }, [renderGraph]);


  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }



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
    setGenerate((generate)=>!generate);
    if (!selectedBoard) {
      return;
    }
  }

  return (
        <View>
          <ImageBackground source={require('./assets/download.png')} style={styles.image}>
             <Header/>
             <Body selectedGraphType={selectedGraphType} selectedGraphTypeHandler={selectedGraphTypeHandler}
              buttonPressedHandler={buttonPressedHandler} graphType={graphType} generate={generate} setSelectedBoard={setSelectedBoard}/>
            </ImageBackground>
          </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    opacity: '0.7',
  },
});

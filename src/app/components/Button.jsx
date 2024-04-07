import React from 'react';
import { Pressable,StyleSheet, Text } from 'react-native';

const Button = ({
  title,
  onClick,
}) => {
  return (
    <Pressable style={ ({pressed}) =>[
      styles.button,
      pressed && {opacity: 0.85, backgroundColor: 'green'},
    ]}
      onPress={()=>onClick()}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: '#050A30',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#7EC8E3',

  },
});

export default Button;

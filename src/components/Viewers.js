import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { dimensions, colors } from '../constants';
import { AppText } from './Labels';


export default function Viewers(props) {
  const { viewers } = props

  return (
    <View style={styles.container}>
      <AppText style={styles.viewer}>{viewers}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30 + dimensions.HEADER_MARGIN,
    left: 20,
    backgroundColor: 'transparent'
  },
  viewer: {
    fontSize: 12,
    backgroundColor: 'white',
    opacity: 0.7,
    color: 'black',
    borderRadius: 6,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
  },
})
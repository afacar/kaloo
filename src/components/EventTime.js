import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { splitDate, formatDuration } from "../utils/Utils";

export default function EventTime(props) {
  let { eventDate, duration } = props.eventTime
  const { date, time, gmt } = splitDate(eventDate)
  return (
    <View style={styles.container}>
      <Text>{date}</Text>
      <Text style={{ color: '#C4C4C4' }}>|</Text>
      <Text style={{ textAlign: 'center' }}>{time + '\n' + `(${gmt} GMT)`}</Text>
      <Text style={{ color: '#C4C4C4' }}>|</Text>
      <Text>{formatDuration(duration)}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderRadius: 6,
    borderColor: '#C4C4C4',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 9,
    backgroundColor: '#FAFAFA'
  },
})
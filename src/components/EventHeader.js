import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EventTime from './EventTime';
import { ClickableText } from './Buttons';
import { formatDuration } from '../utils/Utils';

export default function EventHeader(props) {
  const { event, navigation } = props
  const { image, title, description, eventDate, duration } = event
  const remaining = formatDuration(Math.floor((eventDate.getTime() - new Date().getTime()) / 60000))
  return (
    <View style={styles.container}>
      <Text style={styles.remaining}>{`Starts in ${remaining}`}</Text>
      <Image source={{ uri: image }} style={styles.imageStyle} />
      <Text style={{ fontSize: 21, paddingVertical: 5 }}>{title}</Text>
      <Text style={{ paddingVertical: 5 }}>{description}</Text>
      <EventTime eventTime={{ eventDate, duration }} />
      <View style={{ marginTop: 10 }}>
        <ClickableText
          text='Preview event card'
          onPress={() => navigation.navigate('EventPreview', { event })}
        />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
  },
  remaining: {
    alignSelf: 'flex-end',
    borderWidth: 0.5,
    padding: 5,
    margin: 5,
    borderRadius: 6,
    borderColor: '#030047'
  },
  imageStyle: {
    height: 150,
    borderColor: 'white',
    borderRadius: 6,
  }
})
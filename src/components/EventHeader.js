import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EventTime from './EventTime';
import { ClickableText } from './Buttons';
import { formatDuration } from '../utils/Utils';
import { H1Label, H3Label, Label, RedLabel } from './Labels';
import { app } from '../constants';

const { SUSPENDED, SCHEDULED, COMPLETED, IN_PROGRESS } = app.EVENT_STATUS

export default function EventHeader(props) {
  const { event, navigation } = props
  const { image, title, description, eventDate, duration, status } = event
  let remaining = formatDuration(Math.floor((eventDate.getTime() - new Date().getTime()) / 60000))
  remaining = `Starts in ${remaining}`
  const stat = status === SUSPENDED ? 'On Air' : status === SCHEDULED ? remaining : status === COMPLETED ? 'Finished' : ''
  console.log('stat of eventHeader is ', stat);
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <H1Label label="Up Next" />
        <RedLabel label={stat} />
      </View>
      <Image source={{ uri: image }} style={styles.imageStyle} />
      <H3Label label={title} />
      <Label label={description} />
      <EventTime eventTime={{ eventDate, duration }} />
      <ClickableText
        text='Preview event card'
        onPress={() => navigation.navigate('EventPreview', { event })}
      />
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
    borderRadius: 8,
    marginVertical: 10
  }
})
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EventTime from './EventTime';
import { ClickableText } from './Buttons';
import { formatDuration } from '../utils/Utils';
import { H1Label, H3Label, Label, RedLabel, HighlightedText } from './Labels';
import { app } from '../constants';

const { SUSPENDED, SCHEDULED, COMPLETED, IN_PROGRESS } = app.EVENT_STATUS

export default function EventHeader(props) {
  const { event, navigation } = props
  const { image, title, description, eventDate, duration, status } = event
  let remaining = eventDate ? formatDuration(Math.floor((eventDate.getTime() - new Date().getTime()) / 60000)) : 'Unknown'
  remaining = `Starts in ${remaining}`
  const isActive = status === SUSPENDED || status === IN_PROGRESS;
  const stat = status === SUSPENDED ? 'LIVE' : status === SCHEDULED ? remaining : status === COMPLETED ? 'Finished' : 'In Progress'
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <H1Label label="Up Next" />
        <RedLabel label={stat} />
      </View>
      {isActive && <HighlightedText
        text='You have active audience waiting for you.'
      />}
      <Image source={{ uri: image }} style={styles.imageStyle} />
      <H3Label label={title} />
      <Text style={{ fontSize: 15 }}>{description}</Text>
      <EventTime eventTime={{ eventDate, duration }} />
      <ClickableText
        text='Preview event card'
        onPress={() => navigation.push('EventPreview', { event })}
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
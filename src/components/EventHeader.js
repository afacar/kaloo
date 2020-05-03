import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EventDate from './EventDate';
import { H1Label, H3Label, HighlightedText } from './Labels';
import { app } from '../constants';
import EventStatus from './EventStatus';

const { SUSPENDED, SCHEDULED, COMPLETED, IN_PROGRESS } = app.EVENT_STATUS

export default function EventHeader(props) {
  const { event, soldTickets } = props
  const { image, title, description, eventDate, duration, status, capacity } = event
  const isActive = status === SUSPENDED || status === IN_PROGRESS;
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <H1Label label="Up Next" />
        <EventStatus eventDate={eventDate} status={status} />
      </View>
      {isActive && <HighlightedText
        text='You have active audience waiting for you.'
      />}
      <Image source={{ uri: image }} style={styles.imageStyle} />
      <H3Label label={title} />
      <Text style={{ fontStyle: 'italic' }}>{`${soldTickets} tickets sold`}</Text>
      <Text style={{ fontSize: 15 }}>{description}</Text>
      <EventDate eventTime={{ eventDate, duration }} />
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
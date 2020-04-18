import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import EventTime from './EventTime';
import { ClickableText } from './Buttons';
import { formatDuration } from '../utils/Utils';
import { H1Label, H3Label, Label } from './Labels';

export default function EventHeader(props) {
  const { event, navigation } = props
  const { image, title, description, eventDate, duration } = event
  const remaining = formatDuration(Math.floor((eventDate.getTime() - new Date().getTime()) / 60000))
  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection:"row", justifyContent: 'space-between', alignItems: 'center'}}>
      <H1Label label="Up Next"/>
      <Text style={styles.remaining}>{`Starts in ${remaining}`}</Text>
      </View>
      <Image source={{ uri: image }} style={styles.imageStyle} />
      <H3Label label={title}/>
      <Label label={description}/>
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
    marginVertical:10
  }
})
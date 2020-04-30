import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../appstate/actions/host_actions';
import EventItem from './EventItem';
import { BoldLabel } from './Labels';

function LiveEventList(props) {
  console.log('EventList', props)
  let { events } = props

  if (events.length > 0) {
    return <View>
      <BoldLabel label='Live Now!' />
      {
        events.map((event, i) => {
          return (
            <EventItem
              key={i}
              event={event}
              onPress={() => {
                props.setHostEventListener(event)
                props.setMyViewersListener(event)
                props.navigation.navigate('Host', { eventId: event.eventId })
              }}
            />
          );
        })
      }
    </View>
  }
  return <View />
}

const styles = StyleSheet.create({})

export default connect(null, actions)(LiveEventList)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../appstate/actions/host_actions';
import EventItem from './EventItem';
import { BoldLabel, Label } from './Labels';

function PastEventList(props) {
  console.log('PastEventList', props)
  let { events } = props

  if (events.length > 0) {
    return <View>
      <Label label='Past Events' />
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
  } else {
    return <View />
  }
}

const styles = StyleSheet.create({})

export default connect(null, actions)(PastEventList)
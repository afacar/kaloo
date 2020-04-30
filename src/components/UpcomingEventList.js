import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../appstate/actions/host_actions';
import EventItem from './EventItem';
import { BoldLabel, Label } from './Labels';
import { ClickableText } from './Buttons';

function UpcomingEventList(props) {
  console.log('UpcomingEventList', props)
  let { events } = props

  return <View>
    <Label label='Your Upcoming Events' />
    {(events.length > 0) ? <View>
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
    </View> : <View style={{ alignSelf: 'center', alignItems: 'center', margin: 20 }}>
        <Image source={require('../assets/no-event.png')} />
        <Text>You don’t have any scheduled meetings.</Text>
        <ClickableText text='Let’s create one!' onPress={() => this.props.navigation.navigate('EventCreate')} />
      </View>
    }
  </View>

}

const styles = StyleSheet.create({})

export default connect(null, actions)(UpcomingEventList)
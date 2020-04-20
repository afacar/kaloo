import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider, Button } from "react-native-elements";
import EventTime from './EventTime';
import { H2Label, H3Label, Label } from './Labels';
import { DefaultButton } from './Buttons';

export default function PreviewBody(props) {
  const { displayName, title, eventDate, duration, description, capacity, price } = props.event

  return (
    <View style={{ marginTop: 5, paddingBottom:15}}>
      <View style={{ alignItems: 'center' }}>
        <H2Label label={displayName} />
        <H3Label label={title} />
        <EventTime eventTime={{ eventDate, duration }} />
        <Label label={description || 'No description'} />
      </View>
      {capacity && <View>
        <Text style={{ alignSelf: 'flex-end', marginTop: 15 }}>{capacity} Ticket Left</Text>
        <Slider
          trackStyle={{ height: 10, width: '100%', backgroundColor: '#196BFF', borderBottomRightRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }}
          value={capacity}
          maximumValue={capacity}
          disabled
          thumbTintColor="transperant"
          maximumTrackTintColor="#E7E7E7"
          minimumTrackTintColor="#3598FE"
        />
      </View>}
      {price && <View style={{ paddingTop: 0 }}>
        <DefaultButton
          title={`Buy a ticket for $${price}`}
          onPress={() => { }}
          disabled={true}
        />
      </View>}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {

  },
})
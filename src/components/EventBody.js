import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider, Button } from "react-native-elements";
import AppButton from './AppButton';

export default function EventBody(props) {
  const { displayName, title, eventDate, duration, description, capacity, price } = props.eventBody

  return (
    <View style={{ marginLeft: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{displayName}</Text>
      <Text style={{ fontSize: 30, fontWeight: "normal" }}>{title}</Text>
      <Text style={{ fontSize: 17, color: 'gray' }}>{eventDate.toLocaleString()}</Text>
      <Text style={{ fontSize: 17, color: 'gray' }}>Duration: {duration} minutes</Text>
      <Text style={{ fontSize: 20, fontWeight: '500', marginVertical: 20 }}>{description || 'No description'}</Text>

      <View>
        <Text style={{ alignSelf: 'center', color: 'gray' }}>{capacity} ticket(s) left</Text>
        <Slider
          trackStyle={{ height: 10, backgroundColor: '#196BFF', borderBottomRightRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }}
          value={capacity}
          maximumValue={capacity}
          disabled
          thumbTintColor="transperant"
          maximumTrackTintColor="#E7E7E7"
          minimumTrackTintColor="#196BFF"
        />
      </View>
      <View style={{ paddingTop: 20 }}>
        <Button
          title={`Buy a ticket for $${price}`}
          onPress={() => console.log('This is preview!')}
        />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    
  },
})
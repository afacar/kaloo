import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { splitDate, formatDuration } from "../utils/Utils";
import { Icon } from 'react-native-elements';

export default function EventItem(props) {
  console.log('EventItem', props)

  let { title, eventDate, image } = props.event
  let { onPress } = props
  const { date, time, gmt } = splitDate(eventDate)
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: image }} />
      </View>
      <View style={styles.text}>
        <Text numberOfLines={1} style={{ flexShrink: 1, fontSize: 17, fontWeight: 'bold' }}>{title}</Text>
        <Text style={{ fontSize: 17 }}>{`${date} ${time}`}</Text>
      </View>
      <View style={styles.icon}>
        <Icon
          type='material-community'
          name='chevron-right'
        />
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 81,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#E7E7E7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 1,
    marginVertical: 5
  },
  imageContainer: {
    width: '25%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    flex:1,
    height: '100%',
    justifyContent: 'space-around',
    paddingLeft: 15
  },
  icon: {
    paddingRight: 5
  }
})
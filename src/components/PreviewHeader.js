import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';

export default function PreviewHeader(props) {
  const { image, photoURL, eventType } = props.event

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: image }}
        style={{ width: '100%', height: '100%' }}
        imageStyle={{ borderTopLeftRadius: 6, height: '75%', borderTopRightRadius: 6 }}
      >
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image source={{ uri: photoURL }} style={styles.userPhotoStyle} />
          <Text style={styles.eventTypeStyle}>{eventType}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: 190,
    paddingVertical: 10,
  },
  userPhotoStyle: {
    height: 84,
    width: 84,
    borderColor: 'white',
    borderRadius: 6,
    borderWidth: 4,
    marginLeft: 10,
    alignSelf: 'flex-end',
    bottom: 0
  },
  eventTypeStyle: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF3131',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    color: 'white',
    borderRadius: 6,
    fontSize: 15,
    marginVertical: 5
  }
})
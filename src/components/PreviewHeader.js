import React from 'react';
import { View, Image, ImageBackground, StyleSheet, Text } from 'react-native';

export default function PreviewHeader(props) {
  const { image, photoURL, price } = props.event

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: image }}
        style={{ width: '100%', height: '100%' }}
        imageStyle={{ height: '85%' }}

      >
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
          <Image source={{ uri: photoURL }} style={styles.userPhotoStyle} />
        </View>
        {price && <Text style={styles.price}>${price}</Text>}
      </ImageBackground>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: 190,
  },
  price: {
    position: 'absolute',
    top:10,
    right: 10,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontWeight: 'bold'
  },
  userPhotoStyle: {
    height: 75,
    width: 75,
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 4,
    //marginLeft: 10,
    alignSelf: 'flex-end',
    bottom: 0
  },
})
import React from 'react';
import { View, Image, ImageBackground, StyleSheet } from 'react-native';

export default function PreviewHeader(props) {
  const { image, photoURL } = props.event

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: image }}
        style={{ width: '100%', height: '100%' }}
        imageStyle={{height:'85%'}}
        
      >
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
          <Image source={{ uri: photoURL }} style={styles.userPhotoStyle}/>
        </View>
      </ImageBackground>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: 190,
  },
  userPhotoStyle: {
    height: 84,
    width: 84,
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 4,
    marginLeft: 10,
    alignSelf: 'flex-end',
    bottom: 0
  },
})
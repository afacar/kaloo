import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';

export default function EventImagePicker(props) {
  console.log('EventImagePicker props', props)
  const { onPress, uploading, image } = props

  return (
    <View style={{  }}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: 'column', height: 150, alignContent: 'center' }}>
        <Image containerStyle={{ alignSelf: 'stretch', borderRadius: 8, height: 150, overflow: 'hidden' }}
          source={{ uri: image }}
          style={{ flex: 1 }}
        //resizeMode="contain"
        />
        {uploading ? <ActivityIndicator size='small' style={{
          position: 'absolute',
          right: 5,
          bottom: 5,
        }} /> : <Icon
            reverse
            name="camera"
            type="material-community"
            size={10}
            containerStyle={{
              position: 'absolute',
              right: 5,
              bottom: 5,
            }}
          />

        }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})
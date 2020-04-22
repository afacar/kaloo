import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AgoraView } from 'react-native-agora';

import app from '../constants/app';
import { AppText } from './Labels';

const { IN_PROGRESS } = app.EVENT_STATUS

export default function HostView(props) {
  const { peerIds, status } = props
  const capacity = peerIds.length;

  if (status === IN_PROGRESS) {
    return (
      <View style={{ flex: 1, borderWidth: 5, borderColor: 'blue' }}>
        <View style={{ flex: 1 }}>
          <AgoraView style={{ flex: 1, borderWidth: 2, borderColor: 'red' }} showLocalVideo={true} mode={1} />
        </View>
        <View style={{ flex: 1 }}>
          {
            capacity === 1 && (
              <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
            )
          }
          {
            capacity === 0 && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Image
                  style={{ width: 150, height: 120 }}
                  source={require('../assets/disconnected.png')}
                />
                <AppText style={{ color: 'black', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Waiting for your peer to connect...</AppText>
              </View>
            )
          }
        </View>
      </View>
    )
  }
  else {
    return (
      <View style={{ flex: 1 }}>
        <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
      </View>
    )
  }
}


const styles = StyleSheet.create({

})
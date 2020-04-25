import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AgoraView } from 'react-native-agora';

import app from '../constants/app';
import { AppText } from './Labels';
import Timer from './Timer';

const { IN_PROGRESS } = app.EVENT_STATUS

function WaitingComponent(props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'purple' }}>
      <Image
        style={{ width: 150, height: 120 }}
        source={require('../assets/disconnected.png')}
      />
      <AppText style={{ color: 'black', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
        Waiting for your peer to connect...
      </AppText>
    </View>
  )
}

export default function CallView(props) {
  const { peerIds } = props
  const { status } = props.event
  const capacity = peerIds.length;
  console.log('peerIds at CallView', props)
  if (status === IN_PROGRESS) {
    return (
      <View style={{ flex: 1, borderWidth: 2, borderColor: 'yellow', zIndex: -1100 }}>
        {/** Viewer */}
        <View style={{ flex: 1 }}>
          {capacity == 0 ? (<WaitingComponent />) :
            <View style={{ flex: 1 }}>
              <AgoraView mode={1} key={peerIds[0]} style={{ flex: 1 }} remoteUid={peerIds[0]} />
            </View>
          }
        </View>
        {/** Mirror */}
        <View style={{ flex: 1, borderWidth: 5, borderColor: 'orange' }}>
          <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
        </View>
        <Timer event={props.event} />
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, borderWidth: 2, borderColor: 'yellow', zIndex: -1100 }}>
        {/** Mirror */}
        <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
        <Timer event={props.event} />
      </View>
    )
  }
}


const styles = StyleSheet.create({})
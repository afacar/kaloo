import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AgoraView } from 'react-native-agora';

import app from '../constants/app';
import { AppText } from './Labels';
import Timer from './Timer';

const { IN_PROGRESS } = app.EVENT_STATUS

function ConnectingPeer(props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
  if (status === IN_PROGRESS) {
    return (
      <View style={{ flex: 1, zIndex: -1100 }}>
        {/** Remote Stream */}
        <View style={{ flex: 1 }}>
          {capacity == 0 ? (<ConnectingPeer />) :
            <View style={{ flex: 1 }}>
              <AgoraView mode={1} key={peerIds[0]} style={{ flex: 1 }} remoteUid={peerIds[0]} />
            </View>
          }
        </View>
        {/** Local Stream */}
        <View style={{ flex: 1 }}>
          <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
        </View>
        <Timer event={props.event} />
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, zIndex: -1100 }}>
        {/** Local Stream */}
        <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
        <Timer event={props.event} />
      </View>
    )
  }
}


const styles = StyleSheet.create({})
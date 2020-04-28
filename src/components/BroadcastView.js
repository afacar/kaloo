import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AgoraView } from 'react-native-agora';

import app from '../constants/app';
import { AppText } from './Labels';
import Timer from './Timer';
import Viewers from '../components/Viewers';

const { IN_PROGRESS } = app.EVENT_STATUS

function WaitingHost(props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        style={{ resizeMode:'contain' }}
        source={require('../assets/host-connecting.png')}
      />
      <AppText style={{ color: 'black', marginTop:10, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
        Waiting for the host to connect...
      </AppText>
    </View>
  )
}

export default function BroadcastView(props) {
  const { clientRole, hostId, viewers } = props
  const { status } = props.event
  if (clientRole === 1) {
    /** Host is Broadcasting */
    return (
      <View style={{ flex: 1, zIndex: -1100 }}>
        <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
        <Timer event={props.event} />
        <Viewers viewers={viewers} />
      </View>
    )
  } else if (status === IN_PROGRESS) {
    /** Guest is Watching */
    return (
      <View style={{ flex: 1, zIndex: -1100 }}>
        <AgoraView mode={1} style={{ flex: 1 }} remoteUid={hostId} />
        <Timer event={props.event} />
        <Viewers viewers={viewers} />
      </View>
    )
  } else {
    /** Guest is Waiting for Host */
    return (
      <View style={{ flex: 1 }}>
        <WaitingHost />
        <Timer event={props.event} />
        <Viewers viewers={viewers} />
      </View>
    )
  }

}


const styles = StyleSheet.create({})
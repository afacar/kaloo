import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AgoraView } from 'react-native-agora';

import app from '../constants/app';
import { AppText } from './Labels';
import { dimensions } from '../constants';

const { IN_PROGRESS } = app.EVENT_STATUS



function renderTimer(props) {
  const { time } = props;
  if (time < 0) {
    return (
      <View style={styles.timer}>
        <AppText style={styles.timerCardRed}>{this.state.timeStr}</AppText>
      </View>
    )
  } else {
    return (
      <View style={styles.timerNViewer}>
        <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
      </View>
    )
  }
}

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

export default function BroadcastView(props) {
  const { peerIds, status, clientRole } = props
  const capacity = peerIds.length;
  console.log('peerIds at BroadcastView', peerIds)
  /* if (this.state.peerIds.length !== 0) {
    return (
      <AgoraView mode={1} key={HOST_UID} style={{ flex: 1 }} remoteUid={HOST_UID} />
    )
  } else if {
    return renderWaitingComponent()
  } */
  return (
    <View style={{ flex: 1, borderWidth: 2, borderColor: 'yellow', zIndex: -1100 }}>
      <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
    </View>
  )

}


const styles = StyleSheet.create({
  timerNViewer: {
    position: 'absolute',
    top: 24 + dimensions.HEADER_MARGIN,
    right: 24,
    backgroundColor: 'transparent',
  },
  timer: {
    position: 'absolute',
    top: 24 + dimensions.HEADER_MARGIN,
    right: 24,
    backgroundColor: 'transparent',
  },
  timerCard: {
    fontSize: 12,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 6,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
  }
})
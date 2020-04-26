import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { dimensions, colors } from '../constants';
import { AppText } from '../components/Labels';
import { formatTime } from "../utils/Utils";

export default class Timer extends React.Component {

  state = { remainingTime: this.getRemainingTime() }

  componentDidMount() {
    this.updateTimer()
  }

  componentWillUnmount() {
    if (this.timerListener) {
      clearInterval(this.timerListener)
    }
  }

  getRemainingTime() {
    const { startDate, duration } = this.props.event;
    const durationInSeconds = duration * 60;
    let remainingTime = durationInSeconds
    if (startDate) {
      let sinceStart = Math.floor((new Date() - startDate.toDate()) / 1000)
      remainingTime = durationInSeconds - sinceStart
    }
    return remainingTime
  }

  updateTimer() {
    this.timerListener = setInterval(() => {
      this.setState({ remainingTime: this.getRemainingTime() })
    }, 1000)
  }

  render() {
    const { remainingTime } = this.state
    //this.updateTimer(duration, startDate)
    const style = remainingTime < 0 ? styles.timerCardRed : styles.timerCard
    return (
      <View style={styles.timer}>
        <AppText style={style}>{formatTime(remainingTime)}</AppText>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  timer: {
    position: 'absolute',
    top: 24 + dimensions.HEADER_MARGIN,
    right: 24,
    //backgroundColor: 'rgba(255,255,255,0.5)'
  },
  timerCard: {
    fontSize: 12,
    backgroundColor: 'white',
    opacity: 0.7,
    color: 'black',
    borderRadius: 6,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
  },
  timerCardRed: {
    fontSize: 12,
    backgroundColor: colors.PINK,
    opacity: 0.7,
    color: 'white',
    borderRadius: 6,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
  },
})
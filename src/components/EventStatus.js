import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { formatDuration } from "../utils/Utils";
import { colors, app } from '../constants';
const { SUSPENDED, IN_PROGRESS, COMPLETED } = app.EVENT_STATUS

export default class EventStatus extends React.Component {
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
    let { eventDate } = this.props
    let remainingTime = Math.floor((eventDate.getTime() - new Date().getTime()) / 60000)

    return remainingTime
  }

  updateTimer() {
    this.timerListener = setInterval(() => {
      this.setState({ remainingTime: this.getRemainingTime() })
      console.log('timerListener', this.state.remainingTime);
    }, 60000)
  }

  render() {
    const { remainingTime } = this.state
    const { status } = this.props
    console.log('EventStatis props', this.props);
    
    let statusText = ''
    let statusStyle = ''
    if (status === SUSPENDED || status === IN_PROGRESS) {
      statusText = 'LIVE'
      statusStyle = styles.red
    } else if (status === COMPLETED) {
      statusText = 'Ended'
      statusStyle = styles.white
    } else if (remainingTime > 0) {
      statusText = `Starts in ${formatDuration(remainingTime)}`
      statusStyle = styles.white
    } else {
      statusText = `Overdue for ${formatDuration(remainingTime)}`
      statusStyle = styles.red
    }

    return (
      <View>
        <Text style={statusStyle}>{statusText}</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
  },
  white: {
    borderWidth: 0.5,
    borderRadius: 6,
    borderColor: '#C4C4C4',
    alignItems: 'center',
    padding: 9,
    backgroundColor: 'white'
  },
  red: {
    borderWidth: 0.5,
    borderRadius: 6,
    borderColor: '#C4C4C4',
    alignItems: 'center',
    padding: 9,
    backgroundColor: colors.PINK,
    color: 'white',
    fontWeight: 'bold'
  }
})
import React, { Component } from 'react';
import { View } from 'react-native';
import { app, styles, dimensions } from '../../constants';
import { AppText } from '../Labels';

export default class LiveHeaderTitle extends Component {

    render() {
        const { clientRole, status } = this.props
        if (clientRole === 2) {
            if (status === app.EVENT_STATUS.IN_PROGRESS) {
                return (
                    <AppText style={styles.liveText}>Live</AppText>
                )
            } else {
                return (
                    <View style={styles.connectingCard}>
                        <AppText style={styles.connectingText}>Connecting...</AppText>
                    </View>
                )
            }
        } else {
            if (status === app.EVENT_STATUS.IN_PROGRESS) {
                return (
                    <AppText style={styles.liveText}>Live</AppText>
                )
            } else {
                return (
                    <AppText style={styles.standybyText}>Preview</AppText>
                )
            }
        }
    }
}
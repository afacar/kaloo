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
                    <View style={{ marginLeft: dimensions.HEADER_LEFT_MARGIN }}>
                        <AppText style={styles.liveText}>Live</AppText>
                    </View>
                )
            } else {
                return (
                    <View style={{ marginLeft: dimensions.HEADER_LEFT_MARGIN }}>
                        <View style={styles.connectingCard}>
                            <AppText style={styles.connectingText}>Connecting...</AppText>
                        </View>
                    </View>
                )
            }
        } else {
            if (status === app.EVENT_STATUS.IN_PROGRESS) {
                return (
                    <View style={{ marginLeft: dimensions.HEADER_LEFT_MARGIN }}>
                        <AppText style={styles.liveText}>Live</AppText>
                    </View>
                )
            } else {
                return (
                    <View style={{ marginLeft: dimensions.HEADER_LEFT_MARGIN }}>
                        <AppText style={styles.standybyText}>Test</AppText>
                    </View>
                )
            }
        }
    }
}
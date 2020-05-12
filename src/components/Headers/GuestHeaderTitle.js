import React, { Component } from 'react';
import { connect } from 'react-redux';

import { app, colors } from '../../constants';
import { AppText } from '../Labels';
import { StyleSheet } from 'react-native';

const { IN_PROGRESS, OFFLINE } = app.EVENT_STATUS


class GuestHeaderTitle extends Component {

    render() {
        const { status } = this.props
        const text = status === IN_PROGRESS ? 'Live' : status === OFFLINE ? 'Host Offline' : 'Waiting Host';
        const style = status === IN_PROGRESS ? styles.live : status === OFFLINE ? styles.offline : styles.waiting;
        return <AppText style={style}>{text}</AppText>
    }
}

const styles = StyleSheet.create({
    live: {
        marginLeft: 16,
        fontSize: 12,
        color: 'white',
        backgroundColor: colors.PINK,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },
    waiting: {
        marginLeft: 16,
        fontSize: 12,
        color: 'white',
        backgroundColor: colors.BLUE,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },
    offline: {
        marginLeft: 16,
        fontSize: 12,
        color: 'black',
        backgroundColor: colors.ORANGE,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    }
})

const mapStateToProps = ({ guestEvent }) => {
    const { event } = guestEvent
    return { status: event.status }
}

export default connect(mapStateToProps, null)(GuestHeaderTitle);
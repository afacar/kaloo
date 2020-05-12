import React, { Component } from 'react';
import { connect } from 'react-redux';

import { app, colors } from '../../constants';
import { AppText } from '../Labels';
import { StyleSheet } from 'react-native';

const { IN_PROGRESS, OFFLINE } = app.EVENT_STATUS


class HostHeaderTitle extends Component {

    render() {
        const { status } = this.props
        const text = status === IN_PROGRESS ? 'Live' :  status === OFFLINE ? 'Offline': 'Preview';
        const style = status === IN_PROGRESS ? 'live' : status === OFFLINE ? 'offline' :'preview';
        return <AppText style={styles[style]}>{text}</AppText>
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
    preview: {
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

const mapStateToProps = ({ hostEvents }) => {
    const { hostEvent } = hostEvents
    const status = hostEvent.status
    return { status }
}

export default connect(mapStateToProps, null)(HostHeaderTitle);
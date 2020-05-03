import React, { Component } from 'react';
import { connect } from 'react-redux';

import { app, colors } from '../../constants';
import { AppText } from '../Labels';
import { StyleSheet } from 'react-native';

const { IN_PROGRESS } = app.EVENT_STATUS


class HostHeaderTitle extends Component {

    render() {
        const { status } = this.props
        const text = status === IN_PROGRESS ? 'LIVE' : 'TEST';
        const style = status === IN_PROGRESS ? 'live' : 'preview';
        return <AppText style={styles[style]}>{text}</AppText>
    }
}

const styles = StyleSheet.create({
    live: {
        marginLeft: 16,
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: colors.PINK,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },
    preview: {
        marginLeft: 16,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: colors.BLUE,
        borderRadius: 6,
        textAlign: 'center',
        padding: 8,
        paddingHorizontal: 20
    },

})

const mapStateToProps = ({ hostEvents }) => {
    const { hostEvent } = hostEvents
    const status = hostEvent.status
    return { status }
}

export default connect(mapStateToProps, null)(HostHeaderTitle);
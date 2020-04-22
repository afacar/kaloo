import React, { Component } from 'react';
import { View } from 'react-native';

import { app, styles } from '../../constants';
import { AppText } from '../Labels';
import { connect } from 'react-redux';

const { IN_PROGRESS } = app.EVENT_STATUS


class HostHeaderTitle extends Component {

    render() {
        const { status } = this.props.eventLive
        const { text } = status === IN_PROGRESS ? 'Live' : 'Preview';
        
        return <AppText style={styles.liveText}>{text}</AppText>
    }
}

const mapStateToProps = ({ eventLive }) => {
    return { eventLive }
}

export default connect(mapStateToProps, null)(HostHeaderTitle)
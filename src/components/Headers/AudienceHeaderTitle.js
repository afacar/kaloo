import React, { Component } from 'react';

import { app, styles } from '../../constants';
import { AppText } from '../Labels';
import { connect } from 'react-redux';

const { IN_PROGRESS } = app.EVENT_STATUS


class AudienceHeaderTitle extends Component {

    render() {
        const { status } = this.props.eventLive
        const { text } = status === IN_PROGRESS ? 'Live' : 'Connecting...';

        return <AppText style={styles.liveText}>{text}</AppText>
    }
}

const mapStateToProps = ({ eventLive }) => {
    return { eventLive }
}

export default connect(mapStateToProps, null)(AudienceHeaderTitle)
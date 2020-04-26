import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';
import { connect } from 'react-redux';

import app from '../../constants/app';
const { CALL } = app.EVENT_TYPE


class SwitchCamera extends React.Component {

    render() {
        const { clientRole, eventType } = this.props
        if (clientRole === 1 || eventType === CALL) {
            return (
                <TouchableOpacity
                    style={{ flex: 1, marginRight: 10, justifyContent: 'center' }}
                    onPress={() => RtcEngine.switchCamera()}>
                    <Icon
                        name='camera-switch'
                        type='material-community'
                        color='white'
                    />
                </TouchableOpacity>
            )
        } else {
            return <View />
        }
    }
}

const mapStateToProps = ({ guestEvent }) => {
    console.log('SwitchCamera mapStateToProps guestEvent ', guestEvent)
    const eventType = guestEvent.event && guestEvent.event.eventType || CALL
    return { eventType }
}

export default connect(mapStateToProps, null)(SwitchCamera)
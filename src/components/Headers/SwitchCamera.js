import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';


export default function SwitchCamera(props) {
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
}
import React, { Component, } from 'react';
import { Text } from 'react-native';
import { app } from '../constants';

class AppText extends Component {
    render() {
        return (
            <Text style={[{ fontFamily: app.APP_FONT }, [this.props.style]]}>{this.props.children}</Text>
        )
    }
}
export default AppText;
import React, { Component } from 'react';
import { View } from 'react-native';
import AppButton from './AppButton';
import { Icon } from 'react-native-elements';

export class BackButton extends Component {

    render() {
        return (
            <AppButton onPress={this.props.onPress}>
                <Icon
                    type="MaterialIcons"
                    name="arrow-back"
                    color="black"
                    size={16}
                />
            </AppButton>
        )
    }
}
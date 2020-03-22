import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from './AppText';

export default class AppButton extends Component {

    render() {
        return (
            <TouchableOpacity style={this.props.buttonStyle} onPress={() => this.props.onPress()}>
                <AppText style={this.props.titleStyle} >{this.props.title}</AppText>
            </TouchableOpacity>
        )
    }
}
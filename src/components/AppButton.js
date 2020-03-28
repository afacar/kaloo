import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from './AppText';

export default class AppButton extends Component {

    render() {
        return (
            <TouchableOpacity style={this.props.style} onPress={() => this.props.onPress()}>
                {this.props.children}
            </TouchableOpacity>
        )
    }
}
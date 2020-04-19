import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { colors } from '../../constants';

export default class CustomStatusBar extends Component {

    render() {
        return (
            <StatusBar
                backgroundColor={colors.BLUE}
            />
        )
    }
}
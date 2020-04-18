import React, { Component } from 'react';
import { StatusBar } from 'react-native';

export default class TransparentStatusBar extends Component {

    render() {
        return (
            <StatusBar translucent backgroundColor="transparent" />
        )
    }
}
import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient'

export default class HeaderGradient extends Component {

    render() {
        return (
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.4)']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
        )
    }
}
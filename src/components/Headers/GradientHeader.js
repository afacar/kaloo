import React, { Component } from 'react';
import { View } from 'react-native'
import { Header } from 'react-navigation-stack';

export default class GradientHeader extends Component {

    render() {
        return (
            <View style={{ backgroundColor: '#eee' }}>
                <LinearGradient
                    colors={['red', 'blue']}
                    style={[StyleSheet.absoluteFill, { height: Header.HEIGHT }]}
                >
                    <Header {...this.props} />
                </LinearGradient>
            </View>
        )
    }
}
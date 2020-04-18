import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { colors } from '../../constants';

export default class HeaderLeft extends Component {

    render() {
        return (
            <View>
                <Button
                    type='clear'
                    onPress={() => this.props.onPress()}
                    title={this.props.buttonTitle}
                    titleStyle={[{ color: 'black' }, this.props.buttonTitleStyle]}
                    icon={this.props.icon || { type: 'MaterialIcons', name: 'arrow-back', size: 20, color: 'white' }}
                />
            </View>
        )
    }
}
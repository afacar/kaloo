import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { colors } from '../constants';


var deviceWidth = Dimensions.get('window').width;

export default class Header extends Component {

    render() {
        return (
            <View style={[{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', borderBottomColor: 'white', width: deviceWidth, height: 50 }, this.props.containerStyle]}>
                {
                    this.props.headerLeft || (
                        <Button
                            type='clear'
                            onPress={() => this.props.onPress()}
                            title={this.props.buttonTitle}
                            titleStyle={[{ color: 'black' }, this.props.buttonTitleStyle]}
                            icon={this.props.icon || { type: 'MaterialIcons', name: 'arrow-back', size: 20, color: colors.BLUE }}
                        />
                    )
                }
                {
                    this.props.title
                }
                {
                    <View style={{ justifyContent: 'center', position: 'absolute', right: 10 }}>
                        {this.props.headerRight}
                    </View>
                }
            </View>
        )
    }
}
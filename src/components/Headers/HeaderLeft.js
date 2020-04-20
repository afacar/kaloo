import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { colors } from '../../constants';

export default function HeaderLeft(props) {
    const {icon, onPress, buttonTitle, buttonTitleStyle} = props
    const name = Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left';
    return (
        <View>
            <Button
                type='clear'
                onPress={() => onPress()}
                title={buttonTitle}
                titleStyle={[{ color: 'black' }, buttonTitleStyle]}
                icon={icon || { type: 'material-community', name, size: 20, color: 'white' }}
            />
        </View>
    )
}
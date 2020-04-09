import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function ClickableText(props) {
    const { text, onPress } = props
    return (
        <TouchableOpacity onPress={onPress} >
            <Text style={{ textDecorationLine: 'underline' }}>{text}</Text>
        </TouchableOpacity>
    )

}

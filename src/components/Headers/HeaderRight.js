import React from 'react';
import { Button } from 'react-native-elements';

export default function HeaderRight(props) {
    const { onPress, title } = props

    return (
        <Button
            type='clear'
            onPress={() => onPress()}
            title={title}
            titleStyle={{ color: 'white' }}
            containerStyle={{ paddingRight: 10 }}
        />
    )
}
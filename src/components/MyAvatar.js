import React from 'react';
import { Platform, Image } from 'react-native';
import { Avatar } from 'react-native-elements';



export function MyAvatar(props) {
    const { onPress, source } = props

        return (
            <Image
                onPress={onPress}
                source={source}
                style={{ height: 75, width: 75, borderRadius: 50, marginRight: 20 }}
            />
        )
}

export default MyAvatar;
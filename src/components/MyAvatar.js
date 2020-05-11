import React from 'react';
import { Platform } from 'react-native';
import { Avatar } from 'react-native-elements';



export function MyAvatar(props) {
    const { onPress, source } = props

    if (Platform.OS === 'ios') {
        return (
            <Avatar
                rounded
                size="large"
                overlayContainerStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: "#E7E7E7" }}
                onPress={onPress}
                containerStyle={{ marginRight: 20 }}
                defaultSource={source}
            />
        )
    } else {
        return (
            <Avatar
                rounded
                size="large"
                overlayContainerStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: "#E7E7E7" }}
                onPress={onPress}
                containerStyle={{ marginRight: 20 }}
                source={source}
            />
        )
    }


}

export default MyAvatar;
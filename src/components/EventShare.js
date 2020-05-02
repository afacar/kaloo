import React from 'react';
import { View, Text, Alert, Share, Clipboard, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { BoldLabel } from './Labels';
import { ClearButton } from './Buttons';

async function onShare(link, title) {
    try {
        const result = await Share.share({
            title,
            subject: title,
            message: `${title}\n${link}`, 
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        Alert.alert(error.message);
    }
};

export default function EventShare(props) {
    const { link, title } = props
    return (
        <View>
            <BoldLabel label="Event Link" />
            <View style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: '#BFBFBF',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 6,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginVertical: 15,
                backgroundColor: "#EFF5FF"
            }}>
                <Text numberOfLines={1} style={{ fontSize: 15 }}>
                    {link}
                </Text>
                <TouchableOpacity onPress={() => Clipboard.setString(link)}>
                    <Icon
                        name='content-copy'
                        type='material-community'
                        color='#655FFF'
                    />
                </TouchableOpacity>
            </View>
            <ClearButton
                title='Share'
                onPress={() => onShare(link, title)}
            />
        </View>
    )

}

import React from 'react';
import { View, Text, Alert, Share, Clipboard, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';

async function onShare(link, title) {
    try {
        const result = await Share.share({
            title: title,
            message: link
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
        <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Event Link</Text>
            <Text>Your unique link is ready!</Text>
            <View style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: '#1A6BFE',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 6,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginVertical: 15
            }}>
                <Text numberOfLines={1} style={{ fontSize: 15 }}>
                    {link}
                </Text>
                <TouchableOpacity onPress={() => Clipboard.setString(link)}>
                    <Icon
                        name='content-copy'
                        type='material-community'
                        color='#1A6BFE'
                    />
                </TouchableOpacity>
            </View>
            <Button
                title='Share'
                onPress={() => onShare(link, title)}
                type='clear'
                buttonStyle={{ borderWidth: 1, borderColor: '#3B77EB', borderRadius: 15 }}
            />
        </View>
    )

}

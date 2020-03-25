import React, { Component } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';

export default class DummyMainScreen extends Component {

    /* This method navigates to live broadcast screen 
       @param clientRole, 1 for host, 2 for audience 
    */
    joinLive = (clientRole) => {
        // TODO send channelName and ticketID
        this.props.navigation.navigate('Live', { clientRole, channelProfile: 1 })
    }

    // This method navigates to video chat screen
    joinChat = () => {

        // TODO send channelName and ticketID
        this.props.navigation.navigate('VideoChat', { channelProfile: 0 })
    }


    // camera and audio permissions should be checked on general main screen and events screen not in this dummy one
    checkCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // granted
            } else {
                // not granted
            }
        } catch (err) {
            console.warn(err);
        }
    }

    checkAudioPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone Permission',
                    message:
                        'InfluenceMe needs access to your camera',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // granted
            } else {
                // not granted
            }
        } catch (err) {
            console.warn(err);
        }
    }

    componentDidMount() {
        this.checkAudioPermission();
        this.checkCameraPermission();
    }

    render() {
        // eventType assumed either "live" or "chat"
        var { eventType, user } = this.props;
        if (!eventType)
            eventType = 'chat'; // TODO eventype comes from redux or firebase somewhere around. 
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {
                    eventType === 'live' && (
                        <View>
                            <AppButton
                                style={{ backgroundColor: '#0A84FF', height: 40, width: 200, borderRadius: 25, margin: 10, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.joinLive(1)}>
                                <AppText>Go Live</AppText>
                            </AppButton>
                            <AppButton
                                style={{ backgroundColor: '#0A84FF', height: 40, width: 200, borderRadius: 25, margin: 10, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.joinLive(2)}>
                                <AppText>Join Live</AppText>
                            </AppButton>
                        </View>
                    )
                }
                {
                    eventType === 'chat' && (
                        <View>
                            <AppButton
                                style={{ backgroundColor: '#0A84FF', height: 40, width: 200, borderRadius: 25, margin: 10, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.joinChat()}>
                                <AppText>Join Chat</AppText>
                            </AppButton>
                            {/* <AppButton
                                style={{ backgroundColor: '#0A84FF', height: 40, width: 200, borderRadius: 25, margin: 10, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.joinChat()}>
                                <AppText>Join Chat</AppText>
                            </AppButton> */}
                        </View>
                    )
                }
            </View>
        )
    }
}
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';

export default class DummyMainScreen extends Component {

    /* This method navigates to live broadcast screen 
       @param clientRole, 1 for host, 2 for audience 
    */
    joinLive = (clientRole) => {
        var { event, user } = this.props;
        if (!event) {
            // TODO eventType comes from redux or firebase somewhere around. 
            event = {
                eventID: '1DPfiXvpp2mqlHz0Yam7',
                capacity: "50",
                creationTime: '27 Mart 2020 12: 06: 12 UTC+ 3',
                description: "xcv",
                duration: "30",
                eventDate: '27 Mart 2020 12: 05: 56 UTC + 3',
                eventNumber: 17,
                eventType: "live",
                image: "https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fbroadcast-media.png?alt=media&token=608c9143-879d-4ff7-a30d-ac61ba319904",
                price: "1",
                title: "asd",
                uid: "ktIlp0ovUrMgsR9YVGFOFcooY2I3",
            }
        }
        const { eventID } = event;
        // TODO send  ticketID
        this.props.navigation.navigate('Live', { clientRole, channelProfile: 1, eventID })
    }

    // This method navigates to video call screen
    joinChat = () => {
        var { event, user } = this.props;
        if (!event) {
            // TODO eventType comes from redux or firebase somewhere around. 
            event = {
                eventID: '1DPfiXvpp2mqlHz0Yam7',
                capacity: "50",
                creationTime: '27 Mart 2020 12: 06: 12 UTC+ 3',
                description: "xcv",
                duration: "30",
                eventDate: '27 Mart 2020 12: 05: 56 UTC + 3',
                eventNumber: 17,
                eventType: "live",
                image: "https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fbroadcast-media.png?alt=media&token=608c9143-879d-4ff7-a30d-ac61ba319904",
                price: "1",
                title: "asd",
                uid: "ktIlp0ovUrMgsR9YVGFOFcooY2I3",
            }
        }
        const { eventID } = event;
        // TODO send channelName and ticketID
        this.props.navigation.navigate('VideoChat', { channelProfile: 0, eventID })
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
        // eventType assumed either "live" or "call"
        var { event, user } = this.props;
        if (!event) {
            // TODO eventType comes from redux or firebase somewhere around. 
            event = {
                eventID: '1DPfiXvpp2mqlHz0Yam7',
                capacity: "50",
                creationTime: '27 Mart 2020 12: 06: 12 UTC+ 3',
                description: "xcv",
                duration: "30",
                eventDate: '27 Mart 2020 12: 05: 56 UTC + 3',
                eventNumber: 17,
                eventType: "live",
                image: "https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fbroadcast-media.png?alt=media&token=608c9143-879d-4ff7-a30d-ac61ba319904",
                price: "1",
                title: "asd",
                uid: "ktIlp0ovUrMgsR9YVGFOFcooY2I3",
            }
        }
        const { eventType } = event;
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
                    eventType === 'call' && (
                        <View>
                            <AppButton
                                style={{ backgroundColor: '#0A84FF', height: 40, width: 200, borderRadius: 25, margin: 10, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.joinChat()}>
                                <AppText>Join Chat</AppText>
                            </AppButton>
                        </View>
                    )
                }
            </View >
        )
    }
}
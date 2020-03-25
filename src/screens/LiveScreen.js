import React, { Component } from 'react';
import { View, Text, NativeModules, PermissionsAndroid } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

export default class LiveScreen extends Component {

    state = {
        uid: Math.floor(Math.random() * 100),
        peerIds: [],
        joinSucceed: false,
    };

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

    componentWillMount() {
        const channelProfile = this.props.navigation.getParam('channelProfile', 1);
        const clientRole = this.props.navigation.getParam('clientRole', 2);
        const options = {
            appid: app.AGORA_APP_ID,
            channelProfile,
            clientRole,
            videoEncoderConfig: {
                width: 360,
                height: 480,
                bitrate: 1,
                frameRate: FPS30,
                orientationMode: Adaptative,
            },
            audioProfile: AgoraAudioProfileMusicHighQuality,
            audioScenario: AgoraAudioScenarioShowRoom
        };
        // rtc object
        RtcEngine.on('userJoined', (data) => {
            console.warn("user joined", data);
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
        })
        RtcEngine.on('error', (error) => {
            console.warn("error", error);
        })
        RtcEngine.init(options);
    }

    componentDidMount() {
        this.checkAudioPermission();
        this.checkCameraPermission();
        var channelName = this.props.navigation.getParam('channelName', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        this.setState({
            uid: ticketID
        })
        RtcEngine.joinChannel(channelName, ticketID)
            .then((result) => {
                console.warn("joined channel", result)
            })
            .catch((error) => {
                console.warn("couldn't join channel", error)
            });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    this.props.navigation.getParam('clientRole', 1) === 1 && (
                        <View style={{ flex: 1 }}>
                            <AgoraView style={{ flex: 3 }} showLocalVideo={true} mode={1} />
                            <Text style={{ flex: 1 }}>I am host</Text>
                        </View>
                    )
                }
                {
                    this.props.navigation.getParam('clientRole', 1) === 2 && (
                        <View style={{ flex: 1 }}>
                            <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 3 }} remoteUid={this.state.peerIds[0]} />
                            <Text style={{ flex: 1 }}>I am audience</Text>
                        </View>
                    )
                }
            </View>
        )
    }
}
import React, { Component } from 'react';
import { View, Text, NativeModules, PermissionsAndroid, ScrollView } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileSpeechStandard,
    AgoraAudioScenarioChatRoomEntertainment,
    Adaptative
} = Agora

export default class VideoChatScreen extends Component {

    state = {
        uid: '',
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
        const options = {
            appid: app.AGORA_APP_ID,
            channelProfile,
            videoEncoderConfig: {
                width: 360,
                height: 480,
                bitrate: 1,
                frameRate: FPS30,
                orientationMode: Adaptative,
            },
            audioProfile: AgoraAudioProfileSpeechStandard,
            audioScenario: AgoraAudioScenarioChatRoomEntertainment
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
            // console.warn("error", error);
        })
        RtcEngine.init(options);
    }

    componentDidMount() {
        this.checkAudioPermission();
        this.checkCameraPermission();
        var channelName = this.props.navigation.getParam('channelName', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', Math.floor(Math.random() * 100));
        console.warn('My ticketID is ', ticketID)
        this.setState({
            uid: ticketID
        })
        console.warn('My uid is ', this.state.uid)
        RtcEngine.joinChannel(channelName, ticketID)
            .then((result) => {
                console.warn("joined channel", result)
            })
            .catch((error) => {
                console.warn("couldn't join channel", error)
            });
    }

    renderTwoVideos() {
        return (
            <View style={{ flex: 1 }}>
                <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
            </View>
        )
    }

    renderThreeVideos() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                <AgoraView mode={1} key={this.state.peerIds[1]} style={{ flex: 1 }} remoteUid={this.state.peerIds[1]} />
            </View>
        )
    }

    renderFourVideos() {
        return (
            <View style={{ flex: 1, flexDirection: 'row'  }}>
                {/* <ScrollView horizontal={true} contentContainerStyle={{ flex: 1 }}> */}
                    <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                    <AgoraView mode={1} key={this.state.peerIds[1]} style={{ flex: 1 }} remoteUid={this.state.peerIds[1]} />
                    <AgoraView mode={1} key={this.state.peerIds[2]} style={{ flex: 1 }} remoteUid={this.state.peerIds[2]} />
                {/* </ScrollView> */}
            </View>
        )
    }

    render() {
        console.warn("peer ids ", this.state.peerIds)
        const capacity = this.state.peerIds.length;
        return (
            <View style={{ flex: 1 }}>
                {
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                        </View>
                        {
                            capacity == 1 && (
                                this.renderTwoVideos()
                            )
                        }
                        {
                            capacity == 2 && (
                                this.renderThreeVideos()
                            )
                        }
                        {
                            capacity == 3 && (
                                this.renderFourVideos()
                            )
                        }
                    </View>
                }
            </View>
        )
    }
}
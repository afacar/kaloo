import React, { Component } from 'react';
import { View, Text, NativeModules, PermissionsAndroid, Alert, StatusBar } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
import { styles } from '../constants';
import { clearLiveEventListener, setLiveEventListener, startLive, endLive } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { formatTime } from '../utils/Utils';
import firebase from 'react-native-firebase';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
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
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
        })
        RtcEngine.on('userOffline', (data) => {
            this.setState({
                peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
            })
        })
        RtcEngine.on('error', (error) => {
            // console.warn("error", error);
        })
        RtcEngine.init(options);
    }

    componentDidMount() {
        this.checkAudioPermission();
        this.checkCameraPermission();
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        const clientRole = this.props.navigation.getParam('clientRole', 2);
        var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        this.setState({
            uid: ticketID
        })
        RtcEngine.joinChannel(channelName, ticketID)
            .then((result) => {
                if (clientRole == 2) {
                } else {
                    startLive(channelName);
                }
            })
            .catch((error) => {
                console.warn("join error ", error)
            });

        // setup listener for  watcherCount
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        setLiveEventListener(eventID, ({ status, viewerCount, startedAt }) => {
            var time = 0;
            if (startedAt) {
                time = parseInt(firebase.firestore.Timestamp.now().seconds) - parseInt(startedAt);
                this.setState({ time });
                console.log("time is ", time);
                if (!this.timer) {
                    this.timer = setInterval(() => {
                        var time = this.state.time;
                        var timeStr = formatTime(time);
                        console.log("time 1 is ", time);
                        console.log("timeStr is ", timeStr);
                        this.setState({
                            time: this.state.time + 1,
                            timeStr
                        })
                    }, 1000)
                }
            }
            this.setState({ viewers: viewerCount, status: status })
        });

        // setup back button listener
        const { navigation } = this.props;
        handleAndroidBackButton(navigation, this.backButtonPressed);
    }

    backButtonPressed(navigation) {
        Alert.alert(
            "Confirm Exit",
            "You can continue live from the event page",
            [
                {
                    text: 'Cancel', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        navigation.goBack();
                        navigation.goBack();
                    }
                },
            ],
            { cancelable: false }
        );
    }

    endLive = () => {
        Alert.alert(
            "Confirm End",
            "You cannot continue if you finish the live",
            [
                {
                    text: 'Cancel', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        RtcEngine.leaveChannel();
                        endLive(this.props.navigation.getParam('eventID', 'agora_test'));
                        this.props.navigation.goBack();
                        this.props.navigation.goBack();
                    }
                },
            ],
            { cancelable: false }
        );
    }

    leaveLive = () => {
        this.backButtonPressed(this.props.navigation);
    }

    clearTimer() {
        if (this.timer)
            clearInterval(this.timer);
    }

    renderTwoVideos() {
        return (
            // <View style={{ flex: 1 }}>
            <AgoraView style={styles.localVideoBox} mode={1} showLocalVideo={true} />
            // </View>
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
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* <ScrollView horizontal={true} contentContainerStyle={{ flex: 1 }}> */}
                <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                <AgoraView mode={1} key={this.state.peerIds[1]} style={{ flex: 1 }} remoteUid={this.state.peerIds[1]} />
                <AgoraView mode={1} key={this.state.peerIds[2]} style={{ flex: 1 }} remoteUid={this.state.peerIds[2]} />
                {/* </ScrollView> */}
            </View>
        )
    }

    render() {
        const capacity = this.state.peerIds.length;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                {
                    capacity === 0 && (
                        < AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                    )
                }
                {
                    capacity > 0 && (
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                                <AppButton style={styles.videoQuitButton} onPress={this.endLive}>
                                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16, fontWeight: 'bold' }}>End</AppText>
                                </AppButton>
                                <AppText style={[styles.liveInfo, styles.timerCard]}>{this.state.timeStr}</AppText>
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
                    )
                }
            </View>
        )
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler();
        clearLiveEventListener();
        RtcEngine.leaveChannel()
            .then(res => {
            });
        this.clearTimer();
    }
}
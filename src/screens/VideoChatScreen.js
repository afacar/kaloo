import React, { Component } from 'react';
import { View, Platform, NativeModules, PermissionsAndroid, Alert, StatusBar, ActivityIndicator, Modal } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
import { styles, colors } from '../constants';
import { clearLiveEventListener, setLiveEventListener, startLive, endLive, suspendLive, continueLive } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { formatTime } from '../utils/Utils';
import firebase from 'react-native-firebase';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { Overlay } from 'react-native-elements';
const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

const HOST_UID = 1000;


export default class VideoChatScreen extends Component {

    constructor(props) {
        super(props);
        this.backButtonPressed = this.backButtonPressed.bind(this);
    }

    state = {
        uid: '',
        peerIds: [],
        joinSucceed: false,
        time: 0,
        timeStr: '',
        status: undefined
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
            audioProfile: AgoraAudioProfileMusicHighQuality,
            audioScenario: AgoraAudioScenarioShowRoom
        };
        // rtc object
        RtcEngine.on('userJoined', (data) => {
            const { peerIds } = this.state;
            console.warn('userJoined', data.uid);
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
        })
        RtcEngine.init(options);
    }

    startCall = () => {
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', HOST_UID);
        Alert.alert(
            "Start broadcast",
            "Are you sure you want to start meeting?",
            [
                {
                    text: 'No', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => {
                        RtcEngine.leaveChannel();
                        RtcEngine.joinChannel(channelName, HOST_UID)
                            .then((result) => {
                                startLive(channelName);
                            })
                            .catch((error) => {
                            });
                    }
                },
            ],
            { cancelable: false }
        );
    }

    continueCall = () => {
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', 0);
        Alert.alert(
            "Continue broadcast",
            "Are you sure you want to continue meeting?",
            [
                {
                    text: 'No', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => {
                        RtcEngine.leaveChannel();
                        RtcEngine.joinChannel(channelName, HOST_UID)
                            .then((result) => {
                                continueLive(channelName);
                            })
                            .catch((error) => {
                            });
                    }
                },
            ],
            { cancelable: false }
        );
    }

    suspendCall = () => {
        this.backButtonPressed();
    }

    endCall = () => {
        Alert.alert(
            "Confirm End",
            "Do you want to end your stream early?",
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
                    }
                },
            ],
            { cancelable: false }
        );
    }

    leaveCall = () => {
        this.backButtonPressed();
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            this.checkCameraPermission();
            this.checkAudioPermission();
        }
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        const clientRole = this.props.navigation.getParam('clientRole', 2);
        var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        this.setState({
            uid: ticketID
        })
        if (clientRole === 2) {
            RtcEngine.joinChannel(channelName, ticketID)
                .then((result) => {
                })
                .catch((error) => {
                });
        } else if (clientRole === 1) {
            RtcEngine.joinChannel(firebase.auth().currentUser.uid, HOST_UID)
                .then((result) => {
                })
                .catch((error) => {
                });
        }
        // setup listener for  watcherCount
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        setLiveEventListener(eventID, ({ status, viewerCount, startedAt }) => {
            var time = 0;
            if (startedAt && status === app.EVENT_STATUS.IN_PROGRESS) {
                if (clientRole === 1 && !this.state.joinSucceed) {
                    RtcEngine.leaveChannel();
                    RtcEngine.joinChannel(channelName, HOST_UID)
                        .then((result) => {
                            this.setState({
                                joinSucceed: true
                            })
                        })
                        .catch((error) => {
                        });
                }
                time = parseInt(firebase.firestore.Timestamp.now().seconds) - parseInt(startedAt);
                this.setState({ time });
                if (!this.timer) {
                    this.timer = setInterval(() => {
                        var time = this.state.time;
                        var timeStr = formatTime(time);
                        this.setState({
                            time: this.state.time + 1,
                            timeStr
                        })
                    }, 1000)
                }
            }
            else if (status === app.EVENT_STATUS.COMPLETED && clientRole === 2) {
                this.onEventCompleted();
            }
            this.setState({ viewers: viewerCount || 0, status: status || app.EVENT_STATUS.SCHEDULED })
        });

        // setup back button listener
        const { navigation } = this.props;
        handleAndroidBackButton(this.backButtonPressed);
    }

    onEventCompleted() {
        Alert.alert(
            "Event Finished",
            "Host ended the meeting",
            [

                {
                    text: 'OK', onPress: () => {
                        this.props.navigation.goBack();
                        return false;
                    }
                },
            ],
            { cancelable: false }
        );
    }

    backButtonPressed() {
        const { navigation } = this.props;
        var clientRole = this.props.navigation.getParam('clientRole', 2);
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        Alert.alert(
            "Confirm Exit",
            "You can continue live from MyEvent page",
            [
                {
                    text: 'Cancel', onPress: () => {
                        return true;

                    },
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        if (clientRole === 1) {
                            suspendLive(eventID, this.state.status);
                        }
                        navigation.goBack();
                        return false;
                    }
                },
            ],
            { cancelable: false }
        );
        return true;
    }


    clearTimer() {
        if (this.timer)
            clearInterval(this.timer);
    }

    renderTwoVideos() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                </View>
                <Overlay overlayBackgroundColor="transparent" windowBackgroundColor="transparent" overlayStyle={{ padding: 0, position: 'absolute', bottom: 24, right: 24, }} containerStyle={{ padding: 0, }} isVisible={this.state.peerIds.length == 1} width={180} height={200}>
                    <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                </Overlay>
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
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* <ScrollView horizontal={true} contentContainerStyle={{ flex: 1 }}> */}
                <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                <AgoraView mode={1} key={this.state.peerIds[1]} style={{ flex: 1 }} remoteUid={this.state.peerIds[1]} />
                <AgoraView mode={1} key={this.state.peerIds[2]} style={{ flex: 1 }} remoteUid={this.state.peerIds[2]} />
                {/* </ScrollView> */}
            </View>
        )
    }

    renderStartButton = () => {
        const { status } = this.state;
        if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <AppButton style={styles.startButton} onPress={this.endCall}>
                    <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>End Meeting</AppText>
                </AppButton>
            )
        } else if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <AppButton style={styles.startButton} onPress={this.startCall}>
                    <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Start Meeting</AppText>
                </AppButton>
            )
        } else if (status === app.EVENT_STATUS.SUSPENDED) {
            return (
                <AppButton style={styles.startButton} onPress={this.continueCall}>
                    <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Continue Meeting</AppText>
                </AppButton>
            )
        }
    }

    renderWaitingBox() {
        const { status } = this.state;
        var clientRole = this.props.navigation.getParam('clientRole', 2);
        if (status === app.EVENT_STATUS.IN_PROGRESS && clientRole === 1) {
            return (
                <View style={styles.waitingBox}>
                    <ActivityIndicator size="small" color={colors.GREY} />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold' }}>Waiting for your peer to rejoin...</AppText>
                </View>
            )
        } else if (status === app.EVENT_STATUS.IN_PROGRESS && clientRole === 2) {
            return (
                <View style={styles.waitingBox}>
                    <ActivityIndicator size="small" color={colors.GREY} />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold' }}>Waiting for the host to rejoin...</AppText>
                </View>
            )
        }
    }

    render() {
        const capacity = this.state.peerIds.length;
        const clientRole = this.props.navigation.getParam('clientRole', 1);
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                {
                    capacity === 0 && (
                        <View style={{ flex: 1 }}>
                            <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                            {
                                this.renderWaitingBox()
                            }
                        </View>
                    )
                }
                {
                    capacity === 1 && (
                        this.renderTwoVideos()
                    )
                }
                {
                    clientRole === 1 && (
                        this.renderStartButton()
                    )
                }
                <AppButton style={styles.videoQuitButton} onPress={this.leaveCall}>
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16, fontWeight: 'bold' }}>Go back</AppText>
                </AppButton>
                <View style={styles.liveInfo}>
                    <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                </View>
                {/* {
                    capacity === 0 && (
                        < AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                    )
                }
                {
                    capacity > 0 && (
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                                <AppButton style={styles.videoQuitButton} onPress={this.endCall}>
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
                } */}
            </View>
        )
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler(this.backButtonPressed);
        clearLiveEventListener();
        RtcEngine.leaveChannel()
            .then(res => {
            });
        this.clearTimer();
    }
}
import React, { Component } from 'react';
import { View, Platform, NativeModules, PermissionsAndroid, Alert, StatusBar, TouchableOpacity, Text } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { decrementViewer, clearLiveEventListener, setLiveEventListener, incrementViewer, startLive, endLive, suspendLive, continueLive } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { styles, colors } from '../constants';
import { formatTime } from '../utils/Utils';
import firebase from 'react-native-firebase';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
const { Agora } = NativeModules;
const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

const HOST_UID = 1000;

export default class LiveScreen extends Component {

    constructor(props) {
        super(props);
        this.backButtonPressed = this.backButtonPressed.bind(this);
    }

    state = {
        uid: Math.floor(Math.random() * 100),
        showButtons: false,
        peerIds: [],
        joinSucceed: false,
        viewers: 0,
        duration: 0,
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

    incrementViewers() {
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        var result = incrementViewer(eventID);
        if (result == -1) {
            incrementViewer();
        }
    }

    decrementViewers() {
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        var result = decrementViewer(eventID);
        if (result == -1) {
            this.decrementViewers();
        }
    }

    // componentWillMount() {
    //     // init RTCEngine
    //     const channelProfile = this.props.navigation.getParam('channelProfile', 1);
    //     const clientRole = this.props.navigation.getParam('clientRole', 2);
    //     const options = {
    //         appid: app.AGORA_APP_ID,
    //         channelProfile,
    //         clientRole,
    //         videoEncoderConfig: {
    //             width: 360,
    //             height: 480,
    //             bitrate: 1,
    //             frameRate: FPS30,
    //             orientationMode: Adaptative,
    //         },
    //         audioProfile: AgoraAudioProfileMusicHighQuality,
    //         audioScenario: AgoraAudioScenarioShowRoom
    //     };
    //     // rtc object
    //     RtcEngine.on('userJoined', (data) => {
    //         const { peerIds } = this.state;
    //         if (peerIds.indexOf(data.uid) === -1) {
    //             this.setState({
    //                 peerIds: [...this.state.peerIds, data.uid]
    //             })
    //         }
    //     })
    //     RtcEngine.on('userOffline', (data) => {
    //         this.setState({
    //             peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
    //         })
    //     })
    //     RtcEngine.on('error', (error) => {
    //     })
    //     RtcEngine.init(options);
    // }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.checkCameraPermission();
            this.checkAudioPermission();
        }
        const duration = this.props.navigation.getParam('duration', 30);
        this.setState({ duration, timeStr: formatTime(duration * 60) })
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        const clientRole = this.props.navigation.getParam('clientRole', 2);
        var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        this.setState({
            uid: ticketID
        })

        if (clientRole === 2) {
            RtcEngine.joinChannel(channelName, ticketID)
                .then((result) => {
                    this.incrementViewers();
                })
                .catch((error) => {
                });
        } else if (clientRole === 1) {

            RtcEngine.startPreview();
        }
        // setup listener for  watcherCount
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        setLiveEventListener(eventID, ({ status, viewerCount, startedAt }) => {
            var time = 0;
            if (startedAt) {
                time = parseInt(firebase.firestore.Timestamp.now().seconds) - parseInt(startedAt);
                this.setState({ timeStr: formatTime(this.state.duration * 60 - time) });
            }
            if (startedAt && status === app.EVENT_STATUS.IN_PROGRESS) {
                if (clientRole === 1 && !this.state.joinSucceed) {
                    RtcEngine.stopPreview();
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
                this.setState({ time: this.state.duration * 60 - time });
                if (!this.timer) {
                    this.timer = setInterval(() => {
                        var time = this.state.time;
                        var timeStr = formatTime(time);
                        this.setState({
                            time: this.state.time - 1,
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
        })
        // setup back button listener
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

    startLive = () => {
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', 0);
        Alert.alert(
            "Start broadcast",
            "Are you sure you want to start broadcasting?",
            [
                {
                    text: 'No', onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => {
                        RtcEngine.stopPreview();
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

    continueLive = () => {
        var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        var ticketID = this.props.navigation.getParam('ticketID', 0);
        Alert.alert(
            "Continue broadcast",
            "Are you sure you want to continue broadcasting?",
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

    suspendLive = () => {
        this.backButtonPressed();
    }

    endLive = () => {
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
                        if (clientRole === 1 && this.state.status != app.EVENT_STATUS.SCHEDULED) {
                            suspendLive(eventID);
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


    toggleShowState = () => {
        const { showButtons } = this.state;
        if (!showButtons) {
            this.setState({
                showButtons: true
            })
            setTimeout(() => {
                this.setState({
                    showButtons: false
                })
            }, 3000)
        }
    }

    clearTimer() {
        if (this.timer)
            clearInterval(this.timer);
    }

    reportProblem() {
        console.warn("Report a problem clicked");
    }

    renderLiveInfo() {
        const { status } = this.state;
        var clientRole = this.props.navigation.getParam('clientRole', 2);
        if ((status === app.EVENT_STATUS.SCHEDULED || status === app.EVENT_STATUS.SUSPENDED) && clientRole === 1) {
            return (
                <View style={styles.liveInfo}>
                    <AppText style={styles.standybyText}>Standby</AppText>
                </View>
            )
        } else if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <View style={styles.liveInfo}>
                    <AppText style={styles.liveText}>Live</AppText>
                </View>
            )
        }
    }

    renderTimerNViewer() {
        return (
            <View style={styles.timerNViewer}>
                <View style={{ flex: 1, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText style={styles.viewerText}>{this.state.viewers + ' Viewers'}</AppText>
                </View>
                <View style={{ flex: 1 }}>
                    <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                </View>
            </View>
        )
    }

    renderWaitingComponent() {
        const { status } = this.state;
        var clientRole = this.props.navigation.getParam('clientRole', 2);
        if (status === app.EVENT_STATUS.SUSPENDED || status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <View style={styles.waitingBox}>
                    <Icon
                        type='simple-line-icon'
                        name="globe"
                        size={48}
                        color='white'
                    />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Your Host is connecting...</AppText>
                </View>
            )
        } else if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <View style={styles.waitingBox}>
                    <Icon
                        type='simple-line-icon'
                        name="globe"
                        size={48}
                        color='white'
                    />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Wait for event to start..</AppText>
                </View>
            )
        }
    }

    renderBroadcastButton() {
        const { status } = this.state;
        if (status === app.EVENT_STATUS.COMPLETED) {
            return (
                <AppButton style={styles.startButton} onPress={this.startLive}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            type='font-awesome'
                            name="video-camera"
                            size={16}
                            color="white"
                        />
                        <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Start Broadcasting</AppText>
                    </View>
                </AppButton>
            )
        } else if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <AppButton style={styles.endButton} onPress={this.endLive}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            type='material-community'
                            name="video-off"
                            size={16}
                            color="white"
                        />
                        <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>End Broadcasting</AppText>
                    </View>
                </AppButton>
            )
        } else {
            return (
                <AppButton style={styles.startButton} onPress={this.continueLive}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            type='font-awesome'
                            name="video-camera"
                            size={16}
                            color="white"
                        />
                        <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Continue Broadcasting</AppText>
                    </View>
                </AppButton>
            )
        }
    }

    render() {
        const clientRole = this.props.navigation.getParam('clientRole', 1);
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.toggleShowState()} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <KeepAwake />
                    <StatusBar hidden={true} />
                    <Header
                        buttonTitle={'Quit Call'}
                        buttonTitleStyle={{ color: colors.BLUE, fontSize: 16 }}
                        headerRight={(
                            <TouchableOpacity onPress={this.reportProblem}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.BLUE }}>Report Problem</Text>
                            </TouchableOpacity>
                        )}
                        onPress={this.backButtonPressed}
                    />
                    <View style={{ flex: 1 }}>
                        {
                            // The Host
                            clientRole === 1 && (
                                <View style={{ flex: 1 }}>
                                    <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
                                    {
                                        this.renderTimerNViewer()
                                    }
                                    {
                                        this.renderLiveInfo()
                                    }
                                    {
                                        this.renderBroadcastButton()
                                    }
                                </View>
                            )
                        }
                        {
                            // Viewer
                            clientRole === 2 && (
                                <View style={{ flex: 1 }}>
                                    {
                                        this.state.peerIds.length !== 0 && (
                                            <AgoraView mode={1} key={HOST_UID} style={{ flex: 1 }} remoteUid={HOST_UID} />
                                        )
                                    }
                                    {
                                        this.renderTimerNViewer()
                                    }
                                    {
                                        this.renderLiveInfo()
                                    }
                                    {
                                        this.state.peerIds.length === 0 && (
                                            this.renderWaitingComponent()
                                        )
                                    }
                                </View>
                            )
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler(this.backButtonPressed);
        clearLiveEventListener();
        RtcEngine.leaveChannel()
            .then(res => {
                if (this.props.navigation.getParam('clientRole', 1) === 2)
                    this.decrementViewers();
            });
        this.clearTimer();
    }
}
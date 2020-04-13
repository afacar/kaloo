import React, { Component } from 'react';
import { View, Platform, NativeModules, PermissionsAndroid, Alert, StatusBar, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import firebase from 'react-native-firebase';
import { clearLiveEventListener, setLiveEventListener, startLive, endLive, suspendLive, continueLive } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { formatTime } from '../utils/Utils';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { Overlay, Icon } from 'react-native-elements';
import Header from '../components/Header';
import { colors, styles } from '../constants';
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
        const duration = this.props.navigation.getParam('duration', 60);
        this.setState({ duration, timeStr: formatTime(duration * 60) })
        var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        this.setState({
            uid: ticketID
        })
        if (clientRole === 2) {
            /* RtcEngine.joinChannel(channelName, ticketID)
                .then((result) => {
                })
                .catch((error) => {
                }); */
        } else if (clientRole === 1) {

            RtcEngine.startPreview()
        }
        // setup listener for  watcherCount
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        setLiveEventListener(eventID, ({ status, viewerCount, startedAt }) => {
            var time = 0;
            if (startedAt) {
                time = Date.now() - startedAt.getTime();
                this.setState({ timeStr: formatTime(this.state.duration * 60 - time) });
            }
            if (startedAt && status === app.EVENT_STATUS.IN_PROGRESS) {
                if (clientRole === 1 && !this.state.joinSucceed) {
                    RtcEngine.stopPreview()
                    RtcEngine.joinChannel(channelName, HOST_UID)
                        .then((result) => {
                            this.setState({
                                joinSucceed: true
                            })
                        })
                        .catch((error) => {
                        });
                }
                time = Date.now() - startedAt.getTime();
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
        if (this.state.status !== app.EVENT_STATUS.IN_PROGRESS) {
            return navigation.goBack();
        }
        Alert.alert(
            "Confirm Exit",
            "You can continue call from MyEvent page",
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


    clearTimer() {
        if (this.timer)
            clearInterval(this.timer);
    }

    renderTwoVideos() {
        console.log("rendering two video")
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                </View>
                <View style={{ flex: 1 }}>
                    <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                </View>
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
                <AppButton style={styles.endButton} onPress={this.endCall}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            type='material-community'
                            name="video-off"
                            size={16}
                            color="white"
                        />
                        <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>End Call</AppText>
                    </View>
                </AppButton>
            )
        } else if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <AppButton style={styles.startButton} onPress={this.startCall}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            type='font-awesome'
                            name="video-camera"
                            size={16}
                            color="white"
                        />
                        <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Start Call</AppText>
                    </View>
                </AppButton>
            )
        } else if (status === app.EVENT_STATUS.SUSPENDED) {
            return (
                <AppButton style={styles.startButton} onPress={this.continueCall}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            type='font-awesome'
                            name="video-camera"
                            size={16}
                            color="white"
                        />
                        <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Continue Call</AppText>
                    </View>
                </AppButton>
            )
        }
    }

    renderWaitingComponent() {
        const { status } = this.state;
        var clientRole = this.props.navigation.getParam('clientRole', 2);
        if (status === app.EVENT_STATUS.IN_PROGRESS && clientRole === 1) {
            return (
                <View style={styles.waitingBox}>
                    <Icon
                        type='simple-line-icon'
                        name="globe"
                        size={48}
                        color='white'
                    />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Your peer is connecting...</AppText>
                    <View style={styles.localVideoBox}>
                        <AgoraView style={{ flex: 1, borderRadius: 10 }} showLocalVideo={true} mode={1} />
                    </View>
                </View>
            )
        } else if (status !== app.EVENT_STATUS.COMPLETED && clientRole === 2) {
            return (
                <View style={styles.waitingBox}>
                    <Icon
                        type='simple-line-icon'
                        name="globe"
                        size={48}
                        color='white'
                    />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Your host is connecting...</AppText>
                    <View style={styles.localVideoBox}>
                        <AgoraView style={{ flex: 1, borderRadius: 10 }} showLocalVideo={true} mode={1} />
                    </View>
                </View>
            )
        } else if (status === app.EVENT_STATUS.SCHEDULED || status === app.EVENT_STATUS.SUSPENDED && clientRole === 1) {
            return (
                <View style={{ flex: 1 }}>
                    <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
                </View>
            )
        }
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

    reportProblem() {
        console.warn("Report a problem clicked");
    }

    render() {
        const capacity = this.state.peerIds.length;
        const clientRole = this.props.navigation.getParam('clientRole', 1);
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                <KeepAwake />
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
                        capacity === 1 && (
                            this.renderTwoVideos()
                        )
                    }
                    {
                        capacity === 0 && (
                            this.renderWaitingComponent()
                        )
                    }
                    {
                        clientRole === 1 && (
                            this.renderStartButton()
                        )
                    }
                    {
                        this.renderLiveInfo()
                    }
                    <View style={styles.timerNViewer}>
                        <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                    </View>
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        var eventID = this.props.navigation.getParam('eventID', 'agora_test');
        var clientRole = this.props.navigation.getParam('clientRole', 2);
        if (clientRole === 1 && this.state.status != app.EVENT_STATUS.SCHEDULED) {
            //suspendLive(eventID);
        }
        removeAndroidBackButtonHandler(this.backButtonPressed);
        clearLiveEventListener();
        RtcEngine.leaveChannel()
            .then(res => {
            });
        this.clearTimer();
    }
}
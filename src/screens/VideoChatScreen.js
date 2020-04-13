import React, { Component } from 'react';
import { View, Platform, NativeModules, PermissionsAndroid, Alert, StatusBar, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import firebase from 'react-native-firebase';
import { clearLiveEventListener, setLiveEventListener, startEvent, endLive, suspendLive, continueLive, leaveEvent, setTicketListener, clearTicketListener } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { formatTime, getDeviceID } from '../utils/Utils';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { Overlay, Icon, Button } from 'react-native-elements';
import Header from '../components/Header';
import { colors, styles, app } from '../constants';
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
    liveData = this.props.navigation.getParam('liveData', '')

    state = {
        ...this.liveData,
        uid: '',
        peerIds: [],
        joinSucceed: false,
        duration: 0,
        time: 0,
        timeStr: '',
        status: undefined,
        startLoading: false
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
        const { eventID } = this.state;
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
                        RtcEngine.joinChannel(eventID, HOST_UID)
                            .then(async (result) => {
                                this.setState({
                                    startLoading: true
                                })
                                let response = await startEvent(eventID);
                                if (!response) {
                                    Alert.alert(
                                        'Error occured',
                                        'Unknown error occured while starting your call. Please try again!',
                                        [
                                            {
                                                text: 'Ok', onPress: () => { },
                                                style: 'cancel'
                                            },
                                        ],
                                        { cancelable: false }
                                    )
                                }
                                this.setState({
                                    startLoading: false
                                })
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
        const { eventID } = this.state;
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
                        RtcEngine.joinChannel(eventID, HOST_UID)
                            .then((result) => {
                                continueLive(eventID);
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
        const { eventID } = this.state;
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
                        endLive(eventID);
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
        // var channelName = this.props.navigation.getParam('eventID', 'agora_test');
        // const clientRole = this.props.navigation.getParam('clientRole', 2);
        // const duration = this.props.navigation.getParam('duration', 60);
        // var ticketID = this.props.navigation.getParam('ticketID', Math.random() * 100);
        // this.setState({
        //     uid: ticketID
        // })
        // if (clientRole === 2) {
        //     /* RtcEngine.joinChannel(channelName, ticketID)
        //         .then((result) => {
        //         })
        //         .catch((error) => {
        //         }); */
        // } else if (clientRole === 1) {

        //     RtcEngine.startPreview()
        // }

        // setup listener for  watcherCount
        this.setState({ timeStr: formatTime(this.state.duration * 60) })
        const { eventID, clientRole, ticket } = this.state;
        if (clientRole === 1)
            RtcEngine.startPreview();
        else if (clientRole === 2) {
            this.setTicketListener();
        }
        setLiveEventListener(eventID, ({ status, viewerCount, startedAt }) => {
            var time = 0;
            if (startedAt) {
                time = Math.floor((Date.now() - startedAt.getTime()) / 1000);
                this.setState({ timeStr: formatTime(this.state.duration * 60 - time) });
            }
            if (startedAt && status === app.EVENT_STATUS.IN_PROGRESS) {
                if (clientRole === 1 && !this.state.joinSucceed) {
                    RtcEngine.stopPreview()
                    RtcEngine.joinChannel(eventID, HOST_UID)
                        .then((result) => {
                            this.setState({
                                joinSucceed: true
                            })
                        })
                        .catch((error) => {
                        });
                }
                time = Math.floor((Date.now() - startedAt.getTime()) / 1000);
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

    setTicketListener = () => {
        const { eventID, ticket } = this.state;
        setTicketListener(eventID, ticket, async(remoteID) => {
            var localID = await getDeviceID();
            if (localID != remoteID) {
                Alert.alert(
                    'Multiple Access',
                    'System detected using same ticket from different devices. You can only use you ticket from a single device at a given time',
                    [
                        {
                            text: 'Leave', onPress: () => {
                                this.props.navigation.goBack();
                                return false;
                            }
                        }
                    ],
                    { cancelable: false }
                )
            }
        })
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
        const { clientRole, eventID, status, ticket } = this.state
        if (status !== app.EVENT_STATUS.IN_PROGRESS) {
            if (clientRole === 1) {
                // Suspend live event of host
                suspendLive(eventID);
            } else if (clientRole === 2) {
                //leave live event of audience
                // TODO: leaveEvent func.
                leaveEvent(eventID, ticket)
            }
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
                            // Suspend live event of host
                            suspendLive(eventID);
                        } else if (clientRole === 2) {
                            //leave live event of audience
                            // TODO: leaveEvent func.
                            leaveEvent(eventID, ticket)
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
                <Button
                    icon={
                        <Icon
                            type='material-community'
                            name="video-off"
                            size={16}
                            iconStyle={{ marginRight: 4 }}
                            color="white"
                        />
                    }
                    title='End Call'
                    buttonStyle={styles.endButton}
                    onPress={this.endCall}
                />
            )
        } else if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <Button
                    icon={
                        <Icon
                            type='font-awesome'
                            name="video-camera"
                            size={16}
                            iconStyle={{ marginRight: 4 }}
                            color="white"
                        />
                    }
                    title='Start Call'
                    buttonStyle={styles.startButton}
                    onPress={this.startCall}
                    loading={this.state.startLoading}
                />
            )
        } else if (status === app.EVENT_STATUS.SUSPENDED) {
            return (
                <Button
                    icon={
                        <Icon
                            type='font-awesome'
                            name="video-camera"
                            size={16}
                            iconStyle={{ marginRight: 4 }}
                            color="white"
                        />
                    }
                    title='Continue Call'
                    buttonStyle={styles.startButton}
                    onPress={this.continueCall}
                />
            )
        }
    }

    renderWaitingComponent() {
        const { status, clientRole } = this.state;
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
        const { status, clientRole } = this.state;
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
        const { clientRole } = this.state;
        const capacity = this.state.peerIds.length;
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
        removeAndroidBackButtonHandler(this.backButtonPressed);
        clearLiveEventListener();
        clearTicketListener();
        RtcEngine.leaveChannel()
            .then(res => {
            });
        this.clearTimer();
    }
}
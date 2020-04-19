import React, { Component } from 'react';
import { View, Alert, StatusBar, TouchableOpacity, Text, Dimensions, Image } from 'react-native';
import app from '../constants/app';
import { RtcEngine, AgoraView } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { AppText } from '../components/Labels';
import {
    clearLiveEventListener,
    setLiveEventListener,
    startEvent,
    endLive,
    suspendLive,
    continueLive,
    leaveEvent,
    setTicketListener,
    clearTicketListener,
} from '../utils/EventHandler';
import LinearGradient from 'react-native-linear-gradient'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { styles, colors, dimensions } from '../constants';
import { formatTime, getDeviceID, checkAudioPermission, checkCameraPermission, InfoModal, ConfirmModal } from '../utils/Utils';
import Header from '../components/Header';
import { Icon, Button } from 'react-native-elements';
import HeaderLeft from '../components/Headers/HeaderLeft';
import TransparentStatusBar from '../components/StatusBars/TransparentStatusBar';
import CustomStatusBar from '../components/StatusBars/CustomStatusBar';
import HeaderGradient from '../components/HeaderGradient';
import LiveHeaderTitle from '../components/Headers/LiveHeaderTitle';

const HOST_UID = 1000;
const INITIAL_STATE = {
    uid: Math.floor(Math.random() * 100),
    showButtons: false,
    peerIds: [],
    joinSucceed: false,
    viewers: 0,
    time: 0,
    timeStr: '',
    status: app.EVENT_STATUS.SCHEDULED,
    startLoading: false
};

export default class LiveScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerTransparent:
        {
            ...styles.headerTransparent
        },
        headerBackground: () => (
            <HeaderGradient />
        ),
        headerStyle:
        {
            opacity: 0.7,
        },
        headerTitle: () => {
            const liveData = navigation.getParam('liveData')
            const status = navigation.getParam('status')
            return (
                <LiveHeaderTitle
                    clientRole={liveData.clientRole}
                    status={status}
                />
            )

        },
        headerLeft: () => (
            <HeaderLeft onPress={() => {
                const { clientRole, eventID, ticket } = navigation.getParam('liveData')
                const status = navigation.getParam('status')
                /*         var clientRole = this.props.navigation.getParam('clientRole', 2);
                        var eventID = this.props.navigation.getParam('eventID', 'agora_test'); */
                if (status !== app.EVENT_STATUS.IN_PROGRESS) {
                    if (clientRole === 2)
                        leaveEvent(eventID, ticket)
                    return navigation.goBack();
                }
                Alert.alert(
                    "Confirm Exit",
                    "You can continue show from event screen",
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
            }} />
        ),
        headerRight: () => (
            <TouchableOpacity
                style={{ flex: 1, marginRight: 10 }}
                onPress={() => {
                    RtcEngine.switchCamera()
                }}>
                <Image
                    style={{ flex: 1, width: 30, height: 30, resizeMode: 'contain' }}
                    source={require('../assets/switch-camera.png')}
                />
            </TouchableOpacity>
        )
    });

    constructor(props) {
        super(props);
        this.backButtonPressed = this.backButtonPressed.bind(this);
    }
    liveData = this.props.navigation.getParam('liveData', '')
    state = { ...INITIAL_STATE, ...this.liveData };

    componentDidMount() {
        checkAudioPermission()
        checkCameraPermission()

        // setup listener for  watcherCount
        this.setState({ timeStr: formatTime(this.state.duration * 60) })
        const { eventID, clientRole } = this.state;
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
            if (status) {
                this.props.navigation.setParams({ status })
            }
            if (startedAt && status === app.EVENT_STATUS.IN_PROGRESS) {
                if (clientRole === 1 && !this.state.joinSucceed) {
                    RtcEngine.stopPreview();
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
        handleAndroidBackButton(this.backButtonPressed);
    }

    onEventCompleted() {
        let title = 'Event Finished',
            message = 'Host ended the meeting',
            confirmText = 'Ok',
            onConfirm = () => { this.props.navigation.goBack() };

        InfoModal(title, message, confirmText, onConfirm)
    }

    setTicketListener = () => {
        const { eventID, ticket } = this.state;
        setTicketListener(eventID, ticket, async (remoteID) => {
            var localID = await getDeviceID();
            if (localID != remoteID) {
                this.props.navigation.goBack();
                let title = 'Multiple Access',
                    message = 'System detected using same ticket from different devices. You can only use you ticket from a single device',
                    confirmText = 'Ok',
                    onConfirm = () => { };
                InfoModal(title, message, confirmText, onConfirm)
            }
        })
    }

    onStartLive = () => {
        const { eventID, ticketID } = this.state;
        RtcEngine.stopPreview();
        RtcEngine.joinChannel(eventID, HOST_UID)
            .then(async (result) => {
                this.setState({ startLoading: true })
                let response = await startEvent(eventID);
                if (!response) {
                    RtcEngine.leaveChannel();
                    let title = 'Error occured!',
                        message = 'Unknown error occured while starting your live. Please try again!',
                        onConfirm = () => { }
                    InfoModal(title, message, 'Ok', onConfirm)
                }
                this.setState({ startLoading: false })
            })
            .catch((error) => {
            });
    }

    _startLive = () => {
        let title = 'Start Live?',
            message = 'You will be live!';
        ConfirmModal(title, message, 'I am ready!', 'Not ready!', this.onStartLive)
    }

    _continueLive = () => {
        const { eventID, ticketID } = this.state

        RtcEngine.joinChannel(eventID, HOST_UID)
            .then(async (result) => {
                this.setState({ startLoading: true })
                let response = await continueLive(eventID);
                if (!response) {
                    RtcEngine.leaveChannel();
                    let title = 'Error occured',
                        message = 'Unknown error occured while continuing your live. Please try again!',
                        onConfirm = () => { }
                    InfoModal(title, message, 'Ok', onConfirm)
                }
                this.setState({ startLoading: false })
            })
            .catch((error) => {
            });
    }

    suspendLive = () => {
        this.backButtonPressed();
    }

    onEndLive = () => {
        const { eventID } = this.state
        RtcEngine.leaveChannel();
        endLive(eventID);
        this.props.navigation.goBack();
    }

    _endLive = () => {
        let title = 'Confirm',
            message = 'Do you want to end your stream?';
        ConfirmModal(title, message, 'Ok', 'Cancel', this.onEndLive);
    }

    backButtonPressed() {
        const { clientRole, eventID, status, ticket } = this.state
        const { navigation } = this.props;
        /*         var clientRole = this.props.navigation.getParam('clientRole', 2);
                var eventID = this.props.navigation.getParam('eventID', 'agora_test'); */
        if (status !== app.EVENT_STATUS.IN_PROGRESS) {
            if (clientRole === 2)
                leaveEvent(eventID, ticket)
            return navigation.goBack();
        }
        Alert.alert(
            "Confirm Exit",
            "You can continue show from event screen",
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


    /* toggleShowState = () => {
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
    } */

    clearTimer() {
        if (this.timer)
            clearInterval(this.timer);
    }

    reportProblem() {
        console.warn("Report a problem clicked");
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

    renderTimer() {
        const { time } = this.state;
        if (time < 0) {
            return (
                <View style={styles.timer}>
                    <AppText style={styles.timerCardRed}>{this.state.timeStr}</AppText>
                </View>
            )
        } else {
            return (
                <View style={styles.timerNViewer}>
                    <AppText style={styles.timerCard}>{this.state.timeStr}</AppText>
                </View>
            )
        }
    }

    renderViewers() {
        return (
            <View style={styles.viewerCard}>
                <AppText style={styles.viewerText}>{this.state.viewers + ' Viewers'}</AppText>
            </View>
        )
    }

    renderWaitingComponent() {
        const { status, clientRole } = this.state;
        if (status === app.EVENT_STATUS.SUSPENDED || status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <View style={styles.waitingBox}>
                    <Image
                        style={{ width: 250, height: 220 }}
                        source={require('../assets/host-connecting.png')}
                    />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Your host is connecting...</AppText>
                </View>
            )
        } else if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <View style={styles.waitingBox}>
                    <Image
                        style={{ width: 250, height: 220 }}
                        source={require('../assets/host-connecting.png')}
                    />
                    <AppText style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Wait for event to start..</AppText>
                </View>
            )
        }
    }

    renderBroadcastButton() {
        const { status } = this.state;
        console.warn()
        if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <Button
                    // icon={
                    //     <Icon
                    //         type='font-awesome'
                    //         name="video-camera"
                    //         size={16}
                    //         iconStyle={{ marginRight: 4 }}
                    //         color="white"
                    //     />
                    // }
                    title='Go live!'
                    buttonStyle={styles.startButton}
                    onPress={this._startLive}
                    loading={this.state.startLoading}
                />
            )
        } else if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <Button
                    // icon={
                    // <Icon
                    //     type='material-community'
                    //     name="video-off"
                    //     size={16}
                    //     iconStyle={{ marginRight: 4 }}
                    //     color="white"
                    // />
                    // }
                    title='End Live'
                    buttonStyle={styles.endButton}
                    onPress={this._endLive}
                />
            )
        } else if (status === app.EVENT_STATUS.SUSPENDED) {
            return (
                <Button
                    // icon={
                    //     <Icon
                    //         type='font-awesome'
                    //         name="video-camera"
                    //         size={16}
                    //         iconStyle={{ marginRight: 4 }}
                    //         color="white"
                    //     />
                    // }
                    title='Go Live!'
                    buttonStyle={styles.startButton}
                    onPress={this._continueLive}
                    loading={this.state.startLoading}
                />
            )
        }
    }

    renderMainComponent() {
        console.warn('Without this console warn render does not work properly. I do not know why.')
        if (this.state.peerIds.length !== 0) {
            return (
                <AgoraView mode={1} key={HOST_UID} style={{ flex: 1 }} remoteUid={HOST_UID} />
            )
        } else {
            return this.renderWaitingComponent()
        }
    }

    renderStatusBar() {
        const { status } = this.state;
        console.warn(status)
        if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <TransparentStatusBar />
            )
        } else {
            return (
                <CustomStatusBar />
            )
        }
    }

    render() {
        const { clientRole } = this.state;
        return (
            // <TouchableOpacity activeOpacity={1} onPress={() => this.toggleShowState()} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <KeepAwake />
                <TransparentStatusBar />
                <View style={{ flex: 1 }}>
                    {
                        // The Host
                        clientRole === 1 && (
                            <View style={{ flex: 1 }}>
                                <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
                                {
                                    this.renderTimer()
                                }
                                {
                                    this.renderViewers()
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
                                    this.renderMainComponent()
                                }
                                {
                                    this.renderTimer()
                                }
                                {
                                    this.renderViewers()
                                }
                            </View>
                        )
                    }
                </View>
            </View>
            // </TouchableOpacity>
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
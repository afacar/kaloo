import React, { Component } from 'react';
import { View, Alert, StatusBar, Text, TouchableOpacity } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { clearLiveEventListener, setLiveEventListener, startEvent, endLive, suspendLive, continueLive, leaveEvent, setTicketListener, clearTicketListener } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { formatTime, getDeviceID, checkCameraPermission, checkAudioPermission, ConfirmModal, InfoModal } from '../utils/Utils';
import { AppText } from '../components/Labels';
import { Icon } from 'react-native-elements';
import Header from '../components/Header';
import { colors, styles, app } from '../constants';
import { EndCallButon, StartCallButon, ContinueCallButon } from '../components/Buttons';

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
        time: 0,
        timeStr: '',
        status: undefined,
        startLoading: false
    };

    onStartCall = () => {
        const { eventID } = this.state;
        RtcEngine.leaveChannel();
        RtcEngine.joinChannel(eventID, HOST_UID)
            .then(async (result) => {
                this.setState({ startLoading: true })
                let response = await startEvent(eventID);
                if (!response) {
                    let title = 'Error occured',
                        message = 'Unknown error occured while starting your call. Please try again!',
                        onConfirm = () => { }
                    InfoModal(title, message, 'Ok', onConfirm)
                }
                this.setState({ startLoading: false })
            })
            .catch((error) => {
            });
    }

    _startCall = () => {
        let title = 'Starting broadcast',
            message = 'Do you want to start video meeting?';
        ConfirmModal(title, message, 'Yes', 'Cancel', this.onStartCall)
    }

    onContinueCall = () => {
        const { eventID } = this.state;
        RtcEngine.leaveChannel();
        RtcEngine.joinChannel(eventID, HOST_UID)
            .then((result) => {
                continueLive(eventID);
            })
            .catch((error) => {
            });
    }

    _continueCall = () => {
        let title = 'Confirm',
            message = 'Continue video meeting?';
        ConfirmModal(title, message, 'Ok', 'Cancel', this.onContinueCall)
    }

    suspendCall = () => {
        this.backButtonPressed();
    }

    onEndCall = () => {
        const { eventID } = this.state;
        RtcEngine.leaveChannel();
        endLive(eventID);
        this.props.navigation.goBack();
    }

    _endCall = () => {
        let title = 'Confirm',
            message = 'Do you want to end your meeting?',
            confirmText = 'Yes',
            cancelText = 'No';
        ConfirmModal(title, message, confirmText, cancelText, this.onEndCall)
    }

    leaveCall = () => {
        this.backButtonPressed();
    }

    componentDidMount() {
        checkAudioPermission()
        checkCameraPermission()

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
                this.setState({ timeStr: formatTime(this.state.duration * 60 - time), time: this.state.duration * 60 - time });
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
                this.setState({ time: this.state.duration * 60 - time, time: this.state.duration * 60 - time });
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
                this._onEventCompleted();
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
        setTicketListener(eventID, ticket, async (remoteID) => {
            var localID = await getDeviceID();
            if (localID != remoteID) {
                this.props.navigation.goBack();
                let title = 'Multiple Access',
                    message = 'System detected using same ticket from different devices. You can only use you ticket from a single device at a given time',
                    onConfirm = () => { }
                InfoModal(title, message, 'Ok', onConfirm)
            }
        })
    }

    _onEventCompleted() {
        let title = 'Meeting finished',
            message = 'Your host ended the meeting!',
            onConfirm = () => { this.props.navigation.goBack() }
        InfoModal(title, message, 'Ok', onConfirm)
    }

    _onSuspend = () => {
        // Suspend live event of host
        const { navigation } = this.props;
        const { eventID } = this.state
        suspendLive(eventID)
        navigation.goBack();
        return false;
    }

    backButtonPressed() {
        const { navigation } = this.props;
        const { clientRole, eventID, status, ticket } = this.state
        if (status !== app.EVENT_STATUS.IN_PROGRESS) {
            if (clientRole === 2)
                leaveEvent(eventID, ticket)
            return navigation.goBack();
        }
        // Confirm host before suspend streaming
        let title = 'Leave call?',
            message = 'Meeting is not finished yet, you can still continue!';

        ConfirmModal(title, message, 'Ok', 'Cancel', this._onSuspend)
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

    renderTimer() {
        const { time, timeStr } = this.state;
        if (time < 0) {
            return (
                <View style={styles.timerNViewer}>
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

    /* renderThreeVideos() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                <AgoraView mode={1} key={this.state.peerIds[1]} style={{ flex: 1 }} remoteUid={this.state.peerIds[1]} />
            </View>
        )
    } */

    /* renderFourVideos() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <AgoraView style={{ flex: 1 }} mode={1} showLocalVideo={true} />
                <AgoraView mode={1} key={this.state.peerIds[1]} style={{ flex: 1 }} remoteUid={this.state.peerIds[1]} />
                <AgoraView mode={1} key={this.state.peerIds[2]} style={{ flex: 1 }} remoteUid={this.state.peerIds[2]} />
            </View>
        )
    } */

    renderStartButton = () => {
        const { status, startLoading } = this.state;
        if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <EndCallButon onPress={this._endCall} loading={startLoading} />
            )
        } else if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <StartCallButon onPress={this._startCall} loading={startLoading} />
            )
        } else if (status === app.EVENT_STATUS.SUSPENDED) {
            return (
                <ContinueCallButon onPress={this._continueCall} loading={startLoading} />
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
                    {
                        this.renderTimer()
                    }

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
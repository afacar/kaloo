import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Image } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { clearLiveEventListener, setLiveEventListener, startEvent, endLive, suspendLive, continueLive, leaveEvent, setTicketListener, clearTicketListener } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { formatTime, getDeviceID, checkCameraPermission, checkAudioPermission, ConfirmModal, InfoModal } from '../utils/Utils';
import { AppText } from '../components/Labels';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { styles, app, dimensions } from '../constants';
import { EndCallButon, StartCallButon, ContinueCallButon } from '../components/Buttons';
import HeaderGradient from '../components/HeaderGradient';
import LiveHeaderTitle from '../components/Headers/HostHeaderTitle';
import HeaderLeft from '../components/Headers/HeaderLeft';
import TransparentStatusBar from '../components/StatusBars/TransparentStatusBar';

const HOST_UID = 1000;


class VideoChatScreen extends Component {
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
            const { clientRole, status } = navigation.getParam('eventData')
            //const status = navigation.getParam('status')
            return (
                <LiveHeaderTitle
                    clientRole={clientRole}
                    status={status}
                />
            )

        },
        headerLeft: () => (
            <HeaderLeft onPress={() => {
                const { clientRole, eventID, ticket, status } = navigation.getParam('eventData')
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
                style={{ flex: 1, marginRight: 10, justifyContent: 'center' }}
                onPress={() => {
                    RtcEngine.switchCamera()
                }}>
                <Icon
                    name='camera-switch'
                    type='material-community'
                    color='white'
                />
            </TouchableOpacity>
        )
    });

    constructor(props) {
        super(props);
        this.backButtonPressed = this.backButtonPressed.bind(this);
    }

    eventData = this.props.navigation.getParam('eventData', '')

    state = {
        ...this.eventData,
        peerIds: [],
        joinSucceed: false,
        time: 0,
        timeStr: '',
        startLoading: false
    };

    componentDidMount() {
        console.log('VideoChat didMount state', this.state)
        checkAudioPermission()
        checkCameraPermission()

        // setup listener for  watcherCount
        this.setState({ timeStr: formatTime(this.state.duration * 60) })
        const { eventID, clientRole, ticket, status, viewerCount, startedAt } = this.state;
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
            if (status) {
                this.props.navigation.setParams({ status })
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
        handleAndroidBackButton(this.backButtonPressed);
    }

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

    onContinueCall = async () => {
        const { eventID } = this.state;
        this.setState({ startLoading: true })
        let response = await continueLive(eventID);
        if (!response) {
            this.setState({ startLoading: false })
            let title = 'Error occured',
                message = 'Unknown error occured while starting your call. Please try again!',
                onConfirm = () => { }
            InfoModal(title, message, 'Ok', onConfirm)
        } else {
            RtcEngine.leaveChannel();
            RtcEngine.joinChannel(eventID, HOST_UID)
                .then((result) => {
                    this.setState({ startLoading: false })
                })
                .catch((error) => {
                    this.setState({ startLoading: false })
                });
        }

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
        const { eventID, clientRole, ticket } = this.state
        if (clientRole === 1)
            suspendLive(eventID)
        else if (clientRole === 2)
            leaveEvent(eventID, ticket)
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

    /* renderStartButton = () => {
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
    } */

    renderWaitingComponent() {
        const { clientRole } = this.state
        console.warn()
        if (clientRole === 1) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <Image
                        style={{ width: 150, height: 120 }}
                        source={require('../assets/disconnected.png')}
                    />
                    <AppText style={{ color: 'black', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Waiting for your peer to connect...</AppText>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: dimensions.HEADER_MARGIN }}>
                    <Image
                        style={{ width: 150, height: 120 }}
                        source={require('../assets/disconnected.png')}
                    />
                    <AppText style={{ color: 'black', marginLeft: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Waiting for your host to connect...</AppText>
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

    renderHostView() {
        const capacity = this.state.peerIds.length;
        const { status } = this.state
        if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
                    </View>
                    <View style={{ flex: 1 }}>
                        {
                            capacity === 1 && (
                                <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                            )
                        }
                        {
                            capacity === 0 && (
                                this.renderWaitingComponent()
                            )
                        }
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1 }}>
                    <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
                </View>
            )
        }
    }

    renderAudienceView() {
        const capacity = this.state.peerIds.length;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {
                        capacity === 1 && (
                            <AgoraView mode={1} key={this.state.peerIds[0]} style={{ flex: 1 }} remoteUid={this.state.peerIds[0]} />
                        )
                    }
                    {
                        capacity === 0 && (
                            this.renderWaitingComponent()
                        )
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <AgoraView style={{ flex: 1 }} showLocalVideo={true} mode={1} />
                </View>
            </View>
        )
    }

    renderBroadcastButton() {
        const { status } = this.state;
        console.warn()
        if (status === app.EVENT_STATUS.SCHEDULED) {
            return (
                <Button
                    title='Start Meeting!'
                    buttonStyle={styles.startButton}
                    onPress={this._startCall}
                    loading={this.state.startLoading}
                />
            )
        } else if (status === app.EVENT_STATUS.IN_PROGRESS) {
            return (
                <Button
                    title='End Meeting'
                    buttonStyle={styles.endButton}
                    onPress={this._endCall}
                />
            )
        } else if (status === app.EVENT_STATUS.SUSPENDED) {
            return (
                <Button
                    title='Continue Meeting!'
                    buttonStyle={styles.startButton}
                    onPress={this._continueCall}
                    loading={this.state.startLoading}
                />
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

    render() {
        const { clientRole } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <KeepAwake />
                <TransparentStatusBar />
                <View style={{ flex: 1 }}>
                    {
                        clientRole === 1 && (
                            <View style={{ flex: 1 }}>
                                {
                                    this.renderHostView()
                                }
                                {

                                    this.renderBroadcastButton()
                                }
                            </View>
                        )
                    }
                    {
                        clientRole === 2 && (
                            this.renderAudienceView()
                        )
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

const mapStateToProps = ({ eventLive }) => {
    console.log('VideoChat mapStateToProps', eventLive)
    return { eventLive }
}

export default connect(mapStateToProps, null)(VideoChatScreen)
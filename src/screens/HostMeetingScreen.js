import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Image } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { startEvent, endLive, suspendLive, continueLive } from '../utils/EventHandler';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../utils/BackHandler';
import { checkCameraPermission, checkAudioPermission, ConfirmModal, InfoModal } from '../utils/Utils';
import { AppText } from '../components/Labels';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { styles, app, dimensions } from '../constants';
import { BroadcastButton } from '../components/Buttons';
import HeaderGradient from '../components/HeaderGradient';
import HostHeaderTitle from '../components/Headers/HostHeaderTitle';
import HeaderLeft from '../components/Headers/HeaderLeft';
import TransparentStatusBar from '../components/StatusBars/TransparentStatusBar';
import HostView from '../components/HostView';

const { SCHEDULED, IN_PROGRESS, SUSPENDED, COMPLETED } = app.EVENT_STATUS

const HOST_UID = 1000;


class HostMeetingScreen extends Component {
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
        headerTitle: () => <HostHeaderTitle />,
        headerLeft: () => (
            <HeaderLeft onPress={() => {
                const { eid, status } = navigation.getParam('eventData')
                if (status !== IN_PROGRESS) {
                    return navigation.goBack();
                }
                Alert.alert(
                    "Confirm Exit",
                    "You can continue meeting from event screen",
                    [
                        {
                            text: 'Cancel', onPress: () => {
                                return true;
                            },
                            style: 'cancel'
                        },
                        {
                            text: 'OK', onPress: () => {
                                // Suspend live event of host
                                suspendLive(eid);
                                navigation.goBack();
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
        console.log('HostMeetingScreen DidMount state', this.state)
        checkAudioPermission()
        checkCameraPermission()

        RtcEngine.startPreview();

        this.listenChannel()

        // RtcEngine.stopPreview()
        // setup back button listener
        handleAndroidBackButton(this.backButtonPressed);
    }

    listenChannel = () => {
        RtcEngine.on('userJoined', (data) => {
            console.log('userJoined data', userJoined)
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
            console.log('userJoined state', this.state)
        })
        RtcEngine.on('userOffline', (data) => {
            console.log('userOffline data', userJoined)
            this.setState({
                peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
            })
            console.log('userOffline state', this.state)
        })
        RtcEngine.on('error', (error) => {
        })
    }



    onStartCall = () => {
        const { eid } = this.state;
        RtcEngine.leaveChannel();
        RtcEngine.joinChannel(eid, HOST_UID)
            .then(async (result) => {
                this.setState({ startLoading: true })
                let response = await startEvent(eid);
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
        const { eid } = this.state;
        this.setState({ startLoading: true })

        RtcEngine.leaveChannel();
        RtcEngine.joinChannel(eid, HOST_UID)
            .then(async (result) => {
                let response = await continueLive(eid);
                if (!response) {
                    let title = 'Error occured',
                        message = 'Unknown error occured while starting your call. Please try again!',
                        onConfirm = () => { }
                    InfoModal(title, message, 'Ok', onConfirm)
                }
                this.setState({ startLoading: false })
            })
            .catch((error) => {
                this.setState({ startLoading: false })
            });
    }

    _continueCall = () => {
        let title = 'Confirm',
            message = 'Continue video meeting?';
        ConfirmModal(title, message, 'Ok', 'Cancel', this.onContinueCall)
    }

    onEndCall = () => {
        const { eid } = this.state;
        RtcEngine.leaveChannel();
        endLive(eid);
        this.props.navigation.goBack();
    }

    _endCall = () => {
        let title = 'Confirm',
            message = 'Do you want to end your meeting?',
            confirmText = 'Yes',
            cancelText = 'No';
        ConfirmModal(title, message, confirmText, cancelText, this.onEndCall)
    }

    _onSuspend = () => {
        // Suspend live event of host
        const { navigation } = this.props;
        const { eid } = this.state
        suspendLive(eid)
        return navigation.goBack();
    }

    backButtonPressed() {
        const { navigation } = this.props;
        const { status } = this.state
        if (status !== app.EVENT_STATUS.IN_PROGRESS) {
            return navigation.goBack();
        }
        // Confirm host before suspend streaming
        let title = 'Leave call?',
            message = 'Meeting is not finished yet, you can still continue!';

        ConfirmModal(title, message, 'Ok', 'Cancel', this._onSuspend)
        return true;
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
        const { status, peerIds, startLoading } = this.state
        const onPress = status === SCHEDULED ? this._startCall : status === IN_PROGRESS ? this._endCall : this._continueCall;
        return (
            <View style={{ flex: 1 }}>
                <KeepAwake />
                <TransparentStatusBar />
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <HostView status={status} peerIds={peerIds} />
                        <BroadcastButton status={status} loading={startLoading} onPress={onPress} />
                    </View>
                    {
                        this.renderTimer()
                    }
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler(this.backButtonPressed);
        RtcEngine.leaveChannel().then(res => { });
    }
}

const mapStateToProps = ({ eventLive }) => {
    console.log('HostMeetingScreen mapStateToProps', eventLive)
    return { eventLive }
}

export default connect(mapStateToProps, null)(HostMeetingScreen)
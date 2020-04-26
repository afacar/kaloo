import React, { Component } from 'react';
import { View } from 'react-native';
import { RtcEngine } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { startEvent, endLive, suspendLive, continueLive } from '../utils/EventHandler';
import { checkCameraPermission, checkAudioPermission, ConfirmModal, InfoModal } from '../utils/Utils';
import { connect } from 'react-redux';

import * as actions from '../appstate/actions/host_actions';
import { styles, app } from '../constants';
import { BroadcastButton } from '../components/Buttons';
import HeaderGradient from '../components/HeaderGradient';
import HostHeaderTitle from '../components/Headers/HostHeaderTitle';
import HeaderLeft from '../components/Headers/HeaderLeft';
import TransparentStatusBar from '../components/StatusBars/TransparentStatusBar';
import CallView from '../components/CallView';
import SwitchCamera from '../components/Headers/SwitchCamera';
import { WaitingModal } from '../components/Modals';
import BroadcastView from '../components/BroadcastView';

const { HOST_UID } = app;
const { SCHEDULED, IN_PROGRESS, SUSPENDED, COMPLETED } = app.EVENT_STATUS
const { CALL, BROADCAST } = app.EVENT_TYPE


class HostVideoScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTransparent: { ...styles.headerTransparent },
        headerBackground: () => <HeaderGradient />,
        headerStyle: { opacity: 0.7 },
        headerTitle: () => <HostHeaderTitle />,
        headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
        headerRight: () => <SwitchCamera clientRole={1} />
    });

    state = {
        peerIds: [],
        isConnecting: false
    };

    componentDidMount() {
        checkAudioPermission()
        checkCameraPermission()

        RtcEngine.startPreview();

        this.listenChannel()
    }

    listenChannel = () => {
        RtcEngine.on('userJoined', (data) => {
            console.log('userJoined data', data)
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
            console.log('userJoined state', this.state)
        });
        RtcEngine.on('userOffline', (data) => {
            console.log('userOffline data', data)
            this.setState({
                peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
            })
            console.log('userOffline state', this.state)
        });
        RtcEngine.on('error', (error) => {
        });
    }

    onStartCall = async () => {
        const { eventId } = this.props.event;
        RtcEngine.leaveChannel();
        this.setState({ isConnecting: true })
        let response = await startEvent(eventId);
        if (response) {
            RtcEngine.joinChannel(eventId, HOST_UID)
                .then(async (result) => {
                    this.setState({ isConnecting: false })
                })
                .catch((error) => {
                    console.log('Error onStartCall', error)
                    this.setState({ isConnecting: false })
                });
        } else {
            let title = 'Error occured',
                message = 'Unknown error occured while starting your call. Please try again!',
                onConfirm = () => { };
            this.setState({ isConnecting: false })
            InfoModal(title, message, 'Ok', onConfirm)
        }
    }

    _startCall = () => {
        let title = 'Starting broadcast',
            message = 'Do you want to start video meeting?';
        ConfirmModal(title, message, 'Yes', 'Cancel', this.onStartCall)
    }

    onContinueCall = async () => {
        const { eventId } = this.props.event;
        RtcEngine.leaveChannel();
        this.setState({ isConnecting: true })
        let response = await continueLive(eventId);
        if (response) {
            console.log('host joinning channel with', eventId, HOST_UID)

            RtcEngine.joinChannel(eventId, HOST_UID)
                .then(async (result) => {
                    this.setState({ isConnecting: false })
                })
                .catch((error) => {
                    this.setState({ isConnecting: false })
                });
        } else {
            this.setState({ isConnecting: false })
            let title = 'Error occured',
                message = 'Unknown error occured while starting your call. Please try again!',
                onConfirm = () => { };
            InfoModal(title, message, 'Ok', onConfirm)
        }
    }

    _continueCall = () => {
        let title = 'Confirm',
            message = 'Continue video meeting?';
        ConfirmModal(title, message, 'Ok', 'Cancel', this.onContinueCall)
    }

    onEndCall = async () => {
        let { event } = this.props;
        this.setState({ isConnecting: true })
        let reponse = await endLive(event.eventId);
        if (reponse) {
            event.status = COMPLETED
            this.props.setHostEventListener(event)
            RtcEngine.leaveChannel();
            this.props.navigation.goBack();
        } else {
            this.setState({ isConnecting: false })
            let title = 'Error occured',
                message = 'Unknown error occured while starting your call. Please try again!',
                onConfirm = () => { };
            InfoModal(title, message, 'Ok', onConfirm)
        }
        this.setState({ isConnecting: false })
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
        console.log('this.prons _onSuspend', this.props)
        const { eventId, status } = this.props.event
        if (status === IN_PROGRESS) {
            suspendLive(eventId)
            // Inform host before suspend streaming
            let title = 'Leaving meeting?',
                message = 'Meeting is not ended, just suspended!',
                onPress = () => { }

            InfoModal(title, message, 'Ok', onPress)
        }
    }

    _onPress = () => {
        const { status } = this.props.event;
        const onPress = status === SCHEDULED ? this._startCall() : status === IN_PROGRESS ? this._endCall() : this._continueCall();
        return onPress
    }

    render() {
        const { peerIds, isConnecting } = this.state
        const { status, eventType } = this.props.event;
        return (
            <View style={{ flex: 1 }}>
                <KeepAwake />
                <TransparentStatusBar />
                <View style={{ flex: 1 }}>
                    {eventType === CALL ? (
                        <CallView
                            event={this.props.event}
                            peerIds={peerIds}
                        />
                    ) : (
                            <BroadcastView
                                event={this.props.event}
                                clientRole={1}
                                viewers={this.props.viewers}
                                hostId={HOST_UID}
                            />
                        )}
                    <BroadcastButton status={status} eventType={eventType} onPress={this._onPress} />
                    <WaitingModal isWaiting={isConnecting} />
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        //removeAndroidBackButtonHandler(this.backButtonPressed);
        this._onSuspend()
        RtcEngine.leaveChannel().then(res => { });
    }
}

const mapStateToProps = ({ hostEvents }) => {
    const { hostEvent, myViewers } = hostEvents
    return { event: hostEvent, viewers: myViewers }
}

export default connect(mapStateToProps, actions)(HostVideoScreen)
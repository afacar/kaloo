import React, { Component } from 'react';
import { View } from 'react-native';
import { RtcEngine } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { checkCameraPermission, checkAudioPermission, ConfirmModal, InfoModal, getDeviceID } from '../utils/Utils';
import { connect } from 'react-redux';

import { styles, app } from '../constants';
import HeaderGradient from '../components/HeaderGradient';
import HeaderLeft from '../components/Headers/HeaderLeft';
import TransparentStatusBar from '../components/StatusBars/TransparentStatusBar';
import CallView from '../components/CallView';
import { WaitingModal } from '../components/Modals';
import GuestHeaderTitle from '../components/Headers/GuestHeaderTitle';
import { leaveEvent } from '../utils/EventHandler';
import BroadcastView from '../components/BroadcastView';
import SwitchCamera from '../components/Headers/SwitchCamera';

const { HOST_UID } = app
const { COMPLETED } = app.EVENT_STATUS
const { CALL } = app.EVENT_TYPE


class VideoScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTransparent: { ...styles.headerTransparent },
        headerBackground: () => <HeaderGradient />,
        headerStyle: { opacity: 0.7 },
        headerTitle: () => <GuestHeaderTitle />,
        headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
        headerRight: () => <SwitchCamera clientRole={2} />
    });

    state = {
        peerIds: [],
        isConnecting: false,
        localDeviceID: null
    };

    async componentDidMount() {
        this._isMounted = true;
        console.log('VideoScreen DidMount state', this.state)
        checkAudioPermission()
        checkCameraPermission()

        let localDeviceID = await getDeviceID()
        this._isMounted && this.setState({ localDeviceID })

        RtcEngine.startPreview();
        this.listenChannel()
    }

    listenChannel = () => {
        RtcEngine.on('userJoined', (data) => {
            console.log('userJoined data', data)
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this._isMounted && this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
            console.log('userJoined state', this.state)
        })
        RtcEngine.on('userOffline', (data) => {
            console.log('userOffline data', data)
            this._isMounted && this.setState({
                peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
            })
            console.log('userOffline state', this.state)
        })
        RtcEngine.on('error', (error) => {
            console.log('listenChannel error', error)
        })
    }

    _onSuspend = () => {
        // Suspend live event of host
        console.log('this.props _onSuspend', this.props)
        const { eventId } = this.props.event
        const ticket = this.props.ticket
        leaveEvent(eventId, ticket)
    }

    _onCompleted = () => {
        this.props.navigation.goBack()
    }

    _onTicketCompromise = async () => {
        this.props.navigation.goBack();
        let title = 'Ticket in use',
            message = 'Same ticket already being used on another device!';
        InfoModal(title, message);
    }

    render() {
        const { peerIds, isConnecting, localDeviceID } = this.state
        const { status, eventType } = this.props.event;

        if (status === COMPLETED) {
            this._onCompleted()
        }
        if (localDeviceID && this.props.ticket.deviceID !== localDeviceID) {
            this._onTicketCompromise()
        }
        return (
            <View style={{ flex: 1 }}>
                <KeepAwake />
                <TransparentStatusBar />
                <View style={{ flex: 1 }}>
                    {eventType === CALL ? (
                        <CallView
                            event={this.props.event}
                            peerIds={peerIds}
                        />) : (
                            <BroadcastView
                                event={this.props.event}
                                clientRole={2}
                                viewers={this.props.viewers}
                                hostId={HOST_UID}
                            />
                        )
                    }
                    <WaitingModal isWaiting={isConnecting} text='We are connecting...' />
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        RtcEngine.leaveChannel().then(res => { });
        this._onSuspend()
        this._isMounted = false;
    }
}

const mapStateToProps = ({ joinEvent }) => {
    console.log('VideoScreen mapStateToProps', joinEvent)
    const { event, ticket, viewers } = joinEvent
    return { event, ticket, viewers }
}

export default connect(mapStateToProps, null)(VideoScreen)
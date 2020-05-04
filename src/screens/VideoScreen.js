import React, { Component } from 'react';
import { View } from 'react-native';
import { RtcEngine } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { checkCameraPermission, checkAudioPermission, InfoModal, getDeviceID } from '../utils/Utils';
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

    _isMounted = null

    async componentDidMount() {
        this._isMounted = true;
        checkAudioPermission()
        checkCameraPermission()

        let localDeviceID = await getDeviceID()
        this._isMounted && this.setState({ localDeviceID })

        RtcEngine.startPreview();
        this.listenChannel()
    }

    listenChannel = () => {
        RtcEngine.on('userJoined', (data) => {
            const { peerIds } = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                console.log('userJouned and isMounted', this._isMounted)
                this._isMounted && this.setState({
                    peerIds: [...this.state.peerIds, data.uid]
                })
            }
        })
        RtcEngine.on('userOffline', (data) => {
            console.log('on userOffline and this._isMounted ', this._isMounted)

            this._isMounted && this.setState({
                peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
            })
        })
        RtcEngine.on('error', (error) => {
            console.log('listenChannel error', error)
        })
    }

    _onSuspend = () => {
        // Suspend live event of host
        console.log('_onsuspend this._isMounted', this._isMounted)
        const { eventId } = this.props.event
        const ticket = this.props.ticket
        leaveEvent(eventId, ticket)
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
        if (localDeviceID && this.props.ticket.deviceID !== localDeviceID) {
            this._isMounted = false;
            this._onTicketCompromise()
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 0.2, borderColor: 'white' }}>
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
        this._isMounted = false;
        console.log('componentWillUnmount _isMounted', this._isMounted)
        RtcEngine.leaveChannel().then(res => { console.log('leaving channel... bye...') });
        this._onSuspend()
    }
}

const mapStateToProps = ({ guestEvent }) => {
    const { event, ticket, viewers } = guestEvent
    return { event, ticket, viewers }
}

export default connect(mapStateToProps, null)(VideoScreen)
import React, { Component } from 'react';
import { View } from 'react-native';
import { RtcEngine } from 'react-native-agora';
import KeepAwake from 'react-native-keep-awake';
import { checkCameraPermission, checkAudioPermission, ConfirmModal, InfoModal } from '../utils/Utils';
import { connect } from 'react-redux';

import { styles, app } from '../constants';
import HeaderGradient from '../components/HeaderGradient';
import HeaderLeft from '../components/Headers/HeaderLeft';
import TransparentStatusBar from '../components/StatusBars/TransparentStatusBar';
import CallView from '../components/CallView';
import SwitchCamera from '../components/Headers/SwitchCamera';
import { WaitingModal } from '../components/Modals';
import AudienceHeaderTitle from '../components/Headers/AudienceHeaderTitle';
import { leaveEvent } from '../utils/EventHandler';

const { COMPLETED } = app.EVENT_STATUS

class ACallScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTransparent: { ...styles.headerTransparent },
        headerBackground: () => <HeaderGradient />,
        headerStyle: { opacity: 0.7 },
        headerTitle: () => <AudienceHeaderTitle />,
        headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
        headerRight: () => <SwitchCamera />
    });

    state = {
        peerIds: [],
        isConnecting: false
    };

    componentDidMount() {
        console.log('ACallScreen DidMount state', this.state)
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
        })
        RtcEngine.on('userOffline', (data) => {
            console.log('userOffline data', data)
            this.setState({
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

    render() {
        const { peerIds, isConnecting } = this.state
        const { status } = this.props.event;

        if (status === COMPLETED) {
            this._onCompleted()
        }
        return (
            <View style={{ flex: 1 }}>
                <KeepAwake />
                <TransparentStatusBar />
                <View style={{ flex: 1 }}>
                    <CallView event={this.props.event} peerIds={peerIds} />
                    <WaitingModal isWaiting={isConnecting} text='We are connecting...' />
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        this._onSuspend()
        RtcEngine.leaveChannel().then(res => { });
    }
}

const mapStateToProps = ({ joinEvent }) => {
    console.log('ACallScreen mapStateToProps', joinEvent)
    const { event, ticket } = joinEvent
    return { event, ticket }
}

export default connect(mapStateToProps, null)(ACallScreen)
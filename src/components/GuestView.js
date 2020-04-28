import React, { Component } from 'react';
import { View, StyleSheet, NativeModules, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';
import { auth } from 'react-native-firebase';

import { app } from '../constants';
import { AppText } from "./Labels";
import { joinEvent, rateEvent } from "../utils/EventHandler";
import PreviewHeader from './PreviewHeader';
import PreviewBody from './PreviewBody';
import CustomStatusBar from './StatusBars/CustomStatusBar';
import { DefaultButton } from './Buttons';
import RatingView from './RatingView';
import { ContactUs } from './ContactUs';
import { WaitingModal } from './Modals';

const { CALL, BROADCAST } = app.EVENT_TYPE;

const { Agora } = NativeModules;
const { SCHEDULED, SUSPENDED, IN_PROGRESS, COMPLETED } = app.EVENT_STATUS

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

class GuestView extends Component {
    state = {
        isRatingComplete: false,
        joinLoading: false,
        rating: 3,
        error: undefined
    }

    componentDidMount() { }

    componentWillUnmount() { }

    onCamera = async () => {
        this.setState({
            joinLoading: true,
            error: undefined
        })
        const { eventType, eventId } = this.props.event
        const ticket = this.props.ticket
        const { navigate } = this.props.navigation
        // Broadcast channelProfile: 1 & Call channelProfile: 0
        let channelProfile = eventType === BROADCAST ? 1 : 0
        // Guest clientRole: 2
        let clientRole = 2
        const options = {
            appid: app.AGORA_APP_ID,
            channelProfile,
            clientRole,
            videoEncoderConfig: {
                width: 360,
                height: 480,
                bitrate: 1,
                frameRate: FPS30,
                orientationMode: Adaptative,
            },
            audioProfile: AgoraAudioProfileMusicHighQuality,
            audioScenario: AgoraAudioScenarioShowRoom
        };
        // Initialize RtcEngine
        RtcEngine.init(options)
        let result = await joinEvent(eventId, ticket)
        if (result.state === 'SUCCESS') {
            RtcEngine.joinChannel(eventId, parseInt(ticket.index))
                .then((res) => {
                    let nextScreen = auth().currentUser ? '' : 'A'
                    nextScreen += 'Video'
                    navigate(nextScreen)
                })
                .catch((error) => {
                    this.setState({ error: error.message || 'Check your connection' })
                })
        } else {
            this.setState({ error: result.message || 'Check your connection' })
        }
        this.setState({ joinLoading: false })
    }

    rateEvent = async () => {
        const { eid, ticket, rating } = this.state;
        this.setState({ isRatingComplete: true })
        rateEvent(eid, ticket, rating)
    }

    changeRate = (rating) => {
        this.setState({ rating })
    }

    render() {
        const { joinLoading } = this.state
        const eventData = this.props.event
        const ticketData = this.props.ticket
        const viewers = this.props.viewers // TODO: Maybe number of online viewes can be shown QuestView later
        const { image, photoURL, title, description, displayName, duration, eventType, eventDate, status } = eventData;
        const disabled = status !== IN_PROGRESS
        const eventTypeName = eventType === CALL ? 'Meeting' : 'Broadcast'
        const buttonTitle = (status === COMPLETED) ? `${eventTypeName} Finished` : (status === SCHEDULED || status === SUSPENDED) ? 'Waiting Host' : `Join ${eventTypeName}`;
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                <CustomStatusBar />
                <Card containerStyle={{ alignSelf: 'stretch' }}>
                    <View>
                        <PreviewHeader
                            event={{ image, photoURL, eventType }}
                        />
                        <PreviewBody
                            event={{ displayName, title, eventDate, duration, description }}
                        />
                        <DefaultButton
                            title={buttonTitle}
                            onPress={this.onCamera}
                            disabled={disabled}
                            loading={joinLoading}
                        />
                        <RatingView event={eventData} ticket={ticketData} />
                        {
                            this.state.error && (
                                <AppText style={{ alignSelf: 'center', fontSize: 16, marginTop: 8, textAlign: 'left', color: 'red' }}>
                                    {this.state.error}
                                </AppText>
                            )
                        }
                    </View>
                </Card>
                <WaitingModal isWaiting={joinLoading} />
                <ContactUs screen='GuestScreen' />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})

export default GuestView;
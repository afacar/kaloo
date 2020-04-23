import React, { Component } from 'react';
import { View, StyleSheet, NativeModules, ScrollView } from 'react-native';
import { Button, Card, AirbnbRating } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';
import { connect } from 'react-redux';

import * as actions from '../appstate/actions/audience_actions';
import { app } from '../constants';
import { AppText } from "./Labels";
import { joinEvent, rateEvent } from "../utils/EventHandler";
import PreviewHeader from './PreviewHeader';
import PreviewBody from './PreviewBody';
import CustomStatusBar from './StatusBars/CustomStatusBar';
import { DefaultButton } from './Buttons';
import { auth } from 'react-native-firebase';

const { MEETING, BROADCAST } = app.EVENT_TYPE;

const { Agora } = NativeModules;
const { SCHEDULED, SUSPENDED, IN_PROGRESS, COMPLETED } = app.EVENT_STATUS

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

class JoinEvent extends Component {
    state = {
        isRatingComplete: false,
        joinLoading: false,
        rating: 3,
        error: undefined
    }

    componentDidMount() {
        console.log('Event state is', this.state)
    }

    componentWillUnmount() {
        //clearEventListener(this.event.eid);
        this.props.clearJoinEventListener()
    }

    onCamera = async () => {
        this.setState({
            joinLoading: true,
            error: undefined
        })
        const { eventType, eventId, duration } = this.props.event
        const ticket = this.props.ticket
        const { navigate } = this.props.navigation
        // live channelProfile: 1 & call channelProfile: 0
        let channelProfile = eventType === BROADCAST ? 1 : 0
        // Audience clientRole: 2
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
            console.log('audience joinning channel with', eventId, ticket.index)
            RtcEngine.joinChannel(eventId, parseInt(ticket.index))
                .then((res) => {
                    let my = auth().currentUser ? 'My' : ''
                    let nextScreen = eventType === BROADCAST ? 'Broadcast' : 'Meeting'
                    navigate(my + nextScreen)
                })
                .catch((error) => {
                    this.setState({ error: error.message || 'Check your connection' })
                })
        } else {
            this.setState({ error: result.message || 'Unknown error' })
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
        const eventData = this.props.event || this.props.navigation.getParam('event')
        const ticketData = this.props.ticket || this.props.navigation.getParam('event').ticket
        const { image, photoURL, title, description, displayName, duration, eventType, eventDate, status, joinLoading } = eventData;
        const disabled = status !== IN_PROGRESS
        const eventTypeName = eventType === MEETING ? 'Meeting' : 'Broadcast'
        const buttonTitle = (status === COMPLETED) ? `${eventTypeName} Finished` : (status === SCHEDULED || status === SUSPENDED) ? 'Waiting Host' : `Join ${eventTypeName}`;
        return (
            <ScrollView contentContainerStyle={styles.container}>
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
                        <View>
                            {
                                (status === COMPLETED && !this.state.isRatingComplete && !ticketData.rate) && (
                                    <View>
                                        <AirbnbRating
                                            count={5}
                                            reviews={["Terrible", "Bad", "OK", "Good", "Unbelievable"]}
                                            defaultRating={3}
                                            onFinishRating={this.changeRate}
                                            size={20}
                                        />
                                        <Button
                                            title="Submit"
                                            buttonStyle={{ marginTop: 12, marginBottom: 12, width: 180, height: 40, alignSelf: 'center', borderRadius: 6 }}
                                            onPress={this.rateEvent}
                                        />
                                    </View>
                                )
                            }
                            {
                                (this.state.isRatingComplete || ticketData.rate) && (
                                    <AppText style={{ fontSize: 16, alignSelf: 'center', marginTop: 12 }}>Thanks For Your Feedback</AppText>
                                )
                            }
                        </View>
                        {
                            this.state.error && (
                                <AppText style={{ alignSelf: 'center', fontSize: 16, marginTop: 8, textAlign: 'left', color: 'red' }}>
                                    {this.state.error}
                                </AppText>
                            )
                        }
                    </View>
                </Card>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})

const mapStateToProps = ({ joinEvent }) => {
    console.log('joinEvent mapStateToProps', joinEvent)
    const { event, ticket } = joinEvent
    return { event, ticket }
}

export default connect(mapStateToProps, actions)(JoinEvent);
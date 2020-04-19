import React, { Component } from 'react';
import { View, StyleSheet, Image, Share, NativeModules, ScrollView } from 'react-native';
import { Button, Text, Card, Rating, AirbnbRating } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';
import { app } from '../constants';
import { AppText } from "./Labels";
import { setEventListener, clearEventListener, joinEvent, rateEvent } from "../utils/EventHandler";
import PreviewHeader from './PreviewHeader';
import PreviewBody from './PreviewBody';
import CustomStatusBar from './StatusBars/CustomStatusBar';
const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

class JoinEvent extends Component {
    event = this.props.event
    state = {
        ...this.event,
        isRatingComplete: false,
        joinLoading: false,
        rating: 3,
        error: undefined
    }

    componentDidMount() {
        console.log('Event state is', this.state)

        setEventListener(this.state.eid, (event) => {
            this.setState({ ...event })
        })
    }

    componentWillUnmount() {
        clearEventListener(this.event.eid);
    }

    onCamera = async () => {
        this.setState({
            joinLoading: true,
            error: undefined
        })
        const { eventType, eid, duration, ticket } = this.state
        console.log('MyJoint onCamera state', this.state)
        const { navigate } = this.props.navigation
        // live channelProfile: 1 & call channelProfile: 0
        let channelProfile = eventType === 'live' ? 1 : 0
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
        let result = await joinEvent(eid, ticket)
        if (result.state === 'SUCCESS') {
            RtcEngine.joinChannel(eid, parseInt(ticket.count))
                .then((res) => {
                    if (eventType === 'live')
                        return navigate('Live', { liveData: { clientRole, channelProfile, eventID: eid, duration, ticket } })
                    else if (eventType === 'call')
                        return navigate('VideoChat', { liveData: { clientRole, channelProfile, eventID: eid, duration, ticket } })
                })
                .catch((error) => {
                    this.setState({ error: result.message || 'Check your connection' })
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
        const { image, photoURL, title, description, displayName, duration, eventType, eventDate, status, ticket } = this.state;
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
                        {
                            ((status === app.EVENT_STATUS.SCHEDULED) || (status === app.EVENT_STATUS.SUSPENDED)) && (
                                <Button title='Waiting...' disabled />
                            )
                        }
                        {
                            status === app.EVENT_STATUS.COMPLETED && (
                                <View>
                                    <Button title='Finished' disabled />
                                    {
                                        (!this.state.isRatingComplete && !ticket.rate) && (
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
                                        (this.state.isRatingComplete || ticket.rate) && (
                                            <AppText style={{ fontSize: 16, alignSelf: 'center', marginTop: 12 }}>Thanks For Your Feedback</AppText>
                                        )
                                    }
                                </View>
                            )
                        }
                        {
                            (status === app.EVENT_STATUS.IN_PROGRESS) && (
                                <View>
                                    <Button title='Join' onPress={this.onCamera} loading={this.state.joinLoading} />
                                    {
                                        this.state.error && (
                                            <AppText style={{ alignSelf: 'center', fontSize: 16, marginTop: 8, textAlign: 'left', color: 'red' }}>{this.state.error}</AppText>
                                        )
                                    }
                                </View>

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

export default JoinEvent;
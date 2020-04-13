import React, { Component } from 'react';
import { View, StyleSheet, Image, Share, NativeModules, ScrollView } from 'react-native';
import { Button, Text, Card, Rating } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';
import { app } from '../constants';
import { setEventListener, clearEventListener, joinEvent, rateEvent } from "../utils/EventHandler";
import { firestore } from "react-native-firebase";
import PreviewHeader from '../components/PreviewHeader';
import PreviewBody from '../components/PreviewBody';
const { Agora } = NativeModules;

const {
    FPS30,
    AgoraAudioProfileMusicHighQuality,
    AgoraAudioScenarioShowRoom,
    Adaptative
} = Agora

const db = firestore()

class JoinEventScreen extends Component {
    event = this.props.navigation.getParam('event', '')
    state = { ...this.event }

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
        if (eventType === 'live') {
            // call joinEvent
            let res = await joinEvent(eid, ticket)
            if (res) {
                RtcEngine.joinChannel(channelName, ticket.tid)
                    .then((result) => {
                        // JoinEvent&Channel successful, redirect user 
                        return navigate('Live', { liveData: { clientRole, channelProfile, eid, duration, ticket } })
                    })
                    .catch((error) => {
                        console.log('RtcEngine.joinChannel live error', error)
                    });
            }
            console.log('Could not join live', error)
        } else if (eventType === 'call') {
            RtcEngine.joinChannel(channelName, ticket.tid)
                .then((result) => {
                    return navigate('VideoChat', { clientRole, channelProfile, eventID: eid, duration })
                })
                .catch((error) => {
                    console.log('Could not join call', error)
                });
        }
    }

    rateEvent = (rating) => {
        const { eid, ticket } = this.state;
        rateEvent(eid, ticket, rating)
    }

    render() {
        const { image, photoURL, title, description, displayName, duration, eventType, eventDate, status } = this.state;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Card containerStyle={{ alignSelf: 'stretch' }}>
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
                                <Rating
                                    type='heart'
                                    showRating
                                    showReadOnlyText={true}
                                    onFinishRating={(this.rateEvent)}
                                    style={{ paddingVertical: 10 }}
                                    readonly={this.state.isRatingComplete}
                                />
                            </View>
                        )
                    }
                    {
                        (status === app.EVENT_STATUS.IN_PROGRESS) && (
                            <Button title='Join' onPress={this.onCamera} />
                        )
                    }
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

export default JoinEventScreen;
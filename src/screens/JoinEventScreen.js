import React, { Component } from 'react';
import { View, StyleSheet, Image, Share, NativeModules, ScrollView } from 'react-native';
import { Button, Text, Card, Rating } from 'react-native-elements';
import { RtcEngine } from 'react-native-agora';
import { app } from '../constants';
import { setEventListener, clearEventListener } from "../utils/EventHandler";
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

    onShare = async () => {
        try {
            const result = await Share.share({
                title: this.state.title,
                message: this.state.description + ' ' + this.state.eventLink
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    joinLive = () => {
        var { eid, duration } = this.state;
        // TODO send  ticketID
        this.props.navigation.navigate('Live', { clientRole: 2, channelProfile: 1, eventID: eid + '', duration })
    }

    // This method navigates to video call screen
    joinCall = () => {
        var { eid, duration } = this.state;
        // TODO send ticketID
        this.props.navigation.navigate('VideoChat', { channelProfile: 0, eventID: eid + '', clientRole: 2, duration })
    }

    onCamera = () => {
        if (this.state.eventType === 'live') {
            const options = {
                appid: app.AGORA_APP_ID,
                channelProfile: 1,
                clientRole: 2,
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
            RtcEngine.init(options)
            this.joinLive();
        } else if (this.state.eventType === 'call') {
            const options = {
                appid: app.AGORA_APP_ID,
                channelProfile: 0,
                clientRole: 2,
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
            RtcEngine.init(options)
            this.joinCall();
        }
    }

    rateEvent = (rating) => {
        const { ticket } = this.state;
        console.log('state', this.state)
        const [eventId, _t] = ticket.ticket.split('-')
        let ticketPath = `events/${eventId}/tickets/${ticket.ticket}`
        console.log('ticketPath', ticketPath)
        const eventDoc = db.doc(ticketPath)
        eventDoc.set({ rating }, { merge: true })
            .then(() => {
                this.setState({ isRatingComplete: true })
                console.log('Rating complete!')
            })
            .catch(err => console.log('Rating error:', err.message))
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
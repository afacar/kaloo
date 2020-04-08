import React, { Component } from 'react';
import { View, StyleSheet, Image, Share } from 'react-native';
import { Button, Text, Card, Rating } from 'react-native-elements';
import { app } from '../constants';
import { setEventListener, clearEventListener } from "../utils/EventHandler";
import firebase from "react-native-firebase";

const db = firebase.firestore()

class MyJoinEventScreen extends Component {
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
            this.joinLive();
        } else if (this.state.eventType === 'call') {
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
        const { image, title, description, duration, eventType, capacity, price, eventDate, eventLink, status } = this.state;
        console.log('eventDate is', eventDate)
        console.log('eventDate typeOf is', new Date(eventDate))
        return (
            <View style={styles.container}>
                <Card title={title} containerStyle={{ justifyContent: 'flex-start', alignSelf: 'stretch' }}>
                    <View>
                        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                        <Text>Description: {description}</Text>
                        <Text>Duration: {duration}</Text>
                        <Text>Capacity: {capacity}</Text>
                        <Text>Event Type: {eventType}</Text>
                        <Text>Price: {price}</Text>
                        <Text>Event Date: {new Date(eventDate).toLocaleString()}</Text>
                        <Text>Event Link: {eventLink}</Text>
                        {
                            status !== app.EVENT_STATUS.COMPLETED && <Button title='Share' onPress={this.onShare} />
                        }
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
                    </View>
                </Card>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})

export default MyJoinEventScreen;
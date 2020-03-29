import React, { Component } from 'react';
import { View, StyleSheet, Image, Share } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text, Card } from 'react-native-elements';
import { app } from '../constants';
import { setEventListener, clearEventListener } from "../utils/EventHandler";

class JoinMyEventScreen extends Component {
    event = this.props.navigation.getParam('event', '')
    state = { ...this.event }

    componentDidMount() {
        console.log('Event state is', this.state)

        setEventListener(this.event.eventNumber, (event) => {
            this.setState({ ...event })
        })
    }

    componentWillUnmount() {
        clearEventListener(this.event.eventNumber);
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
        var { eventNumber } = this.state;
        // TODO send  ticketID
        this.props.navigation.navigate('Live', { clientRole: 2, channelProfile: 1, eventID: eventNumber + '' })
    }

    // This method navigates to video call screen
    joinCall = () => {
        var { eventNumber } = this.state;
        // TODO send ticketID
        this.props.navigation.navigate('VideoChat', { channelProfile: 0, eventID: eventNumber + '', clientRole: 2 })
    }

    onCamera = () => {
        if (this.state.eventType === 'live') {
            this.joinLive();
        } else if (this.state.eventType === 'call') {
            this.joinCall();
        }
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, eventLink, status } = this.state;
        console.log('eventDate is', eventDate)
        console.log('eventDate typeOf is', eventDate.toDate())
        return (
            <View style={styles.container}>
                <Card title={title} containerStyle={{ justifyContent: 'flex-start', alignSelf: 'stretch' }}>
                    <View>
                        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                        <Text>description: {description}</Text>
                        <Text>Duration: {duration}</Text>
                        <Text>Capacity: {capacity}</Text>
                        <Text>Event Type: {eventType}</Text>
                        <Text>Price: {price}</Text>
                        <Text>Event Date: {eventDate.toDate().toLocaleString()}</Text>
                        <Text>Event Link: {eventLink}</Text>
                        <Button title='Share' onPress={this.onShare} />
                        {
                            (status === app.EVENT_STATUS.SCHEDULED) && (
                                <Button title='Waiting...' disabled />
                            )
                        }
                        {
                            status === app.EVENT_STATUS.COMPLETED && (
                                <Button title='Finished' disabled />
                            )
                        }
                        {
                            ((status === app.EVENT_STATUS.IN_PROGRESS) || (status === app.EVENT_STATUS.SUSPENDED)) && (
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

export default JoinMyEventScreen;
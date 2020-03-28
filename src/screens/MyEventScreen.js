import React, { Component } from 'react';
import { View, StyleSheet, Image, Share } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text, Card } from 'react-native-elements';
import { app } from '../constants';

class MyEventScreen extends Component {
    event = this.props.navigation.getParam('event', '')
    state = { ...this.event }

    componentDidMount() {
        console.log('Event state is', this.state)
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
        this.props.navigation.navigate('Live', { clientRole: 1, channelProfile: 1, eventID: eventNumber })
    }

    // This method navigates to video call screen
    joinCall = () => {
        var { eventNumber } = this.props;
        // TODO send channelName and ticketID
        this.props.navigation.navigate('VideoChat', { channelProfile: 0, eventID: eventNumber, clientRole: 1 })
    }

    onCamera = () => {
        // TODO: Opening camera here
        console.log('We are live')
        if (this.state.eventType === 'live') {
            this.joinLive();
        } else if (this.state.eventType === 'call'){
            this.joinCall();
        }
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, eventLink, status } = this.state;
        return (
            <View style={styles.container}>
                <Card title={title || 'Some event title'}>
                    <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                    <Text>description: {description || 'No description'}</Text>
                    <Text>Duration: {duration}</Text>
                    <Text>Capacity: {capacity}</Text>
                    <Text>Event Type: {eventType}</Text>
                    <Text>Price: {price}</Text>
                    <Text>Event Date: {eventDate.toLocaleString()}</Text>
                    <Text>Event Link: {eventLink}</Text>
                    <Button title='Share' onPress={this.onShare} />
                    {
                        ((status === app.EVENT_STATUS.SCHEDULED) || (status === app.EVENT_STATUS.SUSPENDED)) && (
                            <Button title='Preview' onPress={this.onCamera} />
                        )
                    }
                    {
                        status === app.EVENT_STATUS.COMPLETED && (
                            <Button title='Finished' disabled />
                        )
                    }
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

export default MyEventScreen;
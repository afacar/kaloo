import React, { Component } from 'react';
import { View, StyleSheet, Image, Share } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Text, Card } from 'react-native-elements';

class JoinEventScreen extends Component {
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

    onCamera = () => {
        // TODO: Opening camera here
        console.log('We are live')
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, eventLink } = this.state;
        console.log('eventDate is', eventDate)
        console.log('eventDate typeOf is', eventDate.toDate() )
        return (
            <View style={styles.container}>
                <Card title={title}>
                    <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                    <Text>description: {description}</Text>
                    <Text>Duration: {duration}</Text>
                    <Text>Capacity: {capacity}</Text>
                    <Text>Event Type: {eventType}</Text>
                    <Text>Price: {price}</Text>
                    <Text>Event Date: {eventDate.toDate().toLocaleString()}</Text>
                    <Text>Event Link: {eventLink}</Text>
                    <Button title='Share' onPress={this.onShare} />
                    <Button title='Test Camera' onPress={this.onCamera} />
                </Card>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default JoinEventScreen;
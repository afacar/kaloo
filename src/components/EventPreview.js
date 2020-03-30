import React, { Component } from 'react';
import { View, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Input, Button, Text, Card } from 'react-native-elements';

class EventPreview extends Component {

    componentDidMount() { }

    componentWillUnmount() { }

    _confirmPublish() {
        console.log('confirm this.props', this.props)
        Alert.alert('You will publish event', 'This can not be undone!',
            [
                {
                    text: 'Cancel', onPress: () => { this.props.cancel() },
                    style: 'cancel'
                },
                {
                    text: 'Yes, Publish', onPress: () => { this.props.publish() }
                },
            ]
        )
    }

    render() {
        const { image, title, description, duration, eventType, capacity, price, eventDate, eventLink, status, isWaiting } = this.props.event;
        console.log('event preview render', this.props)
        return (
            <View style={styles.container}>
                <Card title={eventLink ? `Event Published` : 'Preview'} containerStyle={{ margin: 5 }}>
                    <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                    <Text>Title: {title || 'No title'}</Text>
                    <Text>description: {description || 'No description'}</Text>
                    <Text>Duration: {duration}</Text>
                    <Text>Capacity: {capacity}</Text>
                    <Text>Event Type: {eventType}</Text>
                    <Text>Price: {price}</Text>
                    <Text>Event Date: {eventDate.toLocaleString()}</Text>
                    <Text>Event Link: {eventLink || 'https://inf.me/event/{eventID}'}</Text>
                    <Button title='Share' onPress={this.onShare} />
                </Card>
                {
                    !eventLink && (<View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                        <Button title='Edit' onPress={() => this.props.cancel()} />
                        <Button title='Publish' onPress={() => this._confirmPublish()} />
                    </View>)
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    }
})

export default EventPreview;
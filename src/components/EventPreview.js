import React, { Component } from 'react';
import { View, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Input, Button, Text, Card } from 'react-native-elements';

class EventPreview extends Component {
    state ={
        isPublishing: false
    }

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
                    text: 'Yes, Publish', onPress: () => { 
                        this.setState({ isPublishing: true })
                        this.props.publish() 
                    }
                },
            ]
        )
    }

    render() {
        const { isPublishing } = this.state;
        const { displayName, image, title, description, duration, eventType, capacity, price, eventDate, eventLink, status, isWaiting } = this.props.event;
        console.log('event preview render', this.props)
        return (
            <View style={styles.container}>
                <Card title={isPublishing? 'Creating Event...': 'Preview'} titleStyle={{ backgroundColor: isPublishing? 'green': '#ffff00', borderWidth: 1 }} containerStyle={{ margin: 0 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <Text>Host: {displayName || 'No displayName'}</Text>
                            <Text>Title: {title || 'No title'}</Text>
                            <Text>Description: {description || 'No description'}</Text>
                        </View>
                    </View>
                    <Text>Duration: {duration}</Text>
                    <Text>Capacity: {capacity}</Text>
                    <Text>Event Type: {eventType}</Text>
                    <Text>Price: {price}</Text>
                    <Text>Event Date: {eventDate.toLocaleString()}</Text>
                    <Button title='Share' onPress={this.onShare} disabled />
                </Card>

                <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                    <Button disabled={isWaiting} title='Edit' onPress={() => this.props.cancel()} />
                    <Button disabled={isWaiting} title='Publish' onPress={() => this._confirmPublish()} />
                </View>

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
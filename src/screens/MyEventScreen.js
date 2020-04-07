import React, { Component } from 'react';
import { View, StyleSheet, Image, Share, Platform, BackHandler } from 'react-native';
import { Button, Text, Card, Icon } from 'react-native-elements';
import { app } from '../constants';
import { setEventListener, clearEventListener } from '../utils/EventHandler';

class MyEventScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.getParam('event').title}`,
        headerLeft: () => (
            <Button
                type='clear'
                onPress={() => navigation.navigate('UserHome')}
                containerStyle={{ marginLeft: 15 }}
                icon={<Icon type="ionicon"
                    name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
                    color="black"
                />}
            />
        )
    });

    event = this.props.navigation.getParam('event', '')
    state = { ...this.event }

    componentDidMount() {
        console.log('MyEventScreen Mounted', this.state)
        BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton(this.props.navigation));

        setEventListener(this.state.eid, (event) => {
            if (event) {
                event.eventDate = event.eventDate.toDate()
                this.setState({ ...event })
            }
        })
    }

    handleBackButton(navigation) {
        navigation.popToTop()
        return true
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', () => this.handleBackButton(this.props.navigation));
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
        var { eid } = this.state;
        // TODO send  ticketID
        this.props.navigation.navigate('Live', { clientRole: 1, channelProfile: 1, eventID: eid + '' })
    }

    // This method navigates to video call screen
    joinCall = () => {
        var { eid } = this.state;
        // TODO send channelName and ticketID
        this.props.navigation.navigate('VideoChat', { channelProfile: 0, eventID: eid + '', clientRole: 1 })
    }

    onCamera = () => {
        // TODO: Opening camera here
        console.log('We are live')
        if (this.state.eventType === 'live') {
            this.joinLive();
        } else if (this.state.eventType === 'call') {
            this.joinCall();
        }
    }

    render() {
        const { displayName, image, title, description, duration, eventType, capacity, price, eventDate, eventLink, status } = this.state;
        return (
            <View style={styles.container}>
                <Card>
                    <View>
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
                        {
                            status === app.EVENT_STATUS.IN_PROGRESS && (
                                <Button title='Continue' onPress={this.onCamera} />
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
        alignItems: 'stretch'
    }
})

export default MyEventScreen;
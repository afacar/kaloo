import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, Platform, BackHandler, Text } from 'react-native';
import { Button, Icon, ButtonGroup } from 'react-native-elements';
import ClickableText from '../components/ClickableText';

import { setEventListener, clearEventListener } from '../utils/EventHandler';
import EventShare from '../components/EventShare';
import EventTime from '../components/EventTime';
import EventHeader from '../components/EventHeader';

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

    joinLive = () => {
        var { eid, duration } = this.state;
        // TODO send  ticketID
        this.props.navigation.navigate('Live', { clientRole: 1, channelProfile: 1, eventID: eid + '', duration })
    }

    // This method navigates to video call screen
    joinCall = () => {
        var { eid, duration } = this.state;
        // TODO send channelName and ticketID
        this.props.navigation.navigate('VideoChat', { channelProfile: 0, eventID: eid + '', clientRole: 1, duration })
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
        const thisEvent = { ...this.state, isPublished: true }
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <EventHeader
                    event={thisEvent}
                    navigation={this.props.navigation}
                />
                <EventShare
                    text='Your event isn’t published yet. Event ticket is going to look like this when you publish.'
                    link={thisEvent.eventLink}
                />
                <Button
                    title='Preview audio and video'
                    onPress={this.onCamera}
                    buttonStyle={{ backgroundColor: 'blue', borderRadius: 15 }}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 15,
    }
})

export default MyEventScreen;
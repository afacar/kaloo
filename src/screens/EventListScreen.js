import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Card, ListItem, Avatar } from 'react-native-elements';
import { firestore, auth } from "react-native-firebase";
import { connect } from 'react-redux';

import { setUserProfile } from "../appstate/actions/auth_actions";
import { checkAudioPermission, checkCameraPermission, compare } from '../utils/Utils';
import app from "../constants/app";
import { ContactUs } from '../components/ContactUs';
import { DefaultButton, ClearButton } from '../components/Buttons';
import { Label, BoldLabel } from '../components/Labels';
import DashboardHeader from "../components/DashboardHeader";

const db = firestore()


class EventListScreen extends Component {
    static navigationOptions = { headerShown: false }

    state = {
        liveEvents: [],
        upcomingEvents: [],
        pastEvents: [],
        isLoading: false,
    }

    componentDidMount = async () => {
        this.authListener = auth().onAuthStateChanged(user => {
            console.log('UserHome onAuthStateChange>', user);
            if (user && !user.isAnonymous) {
                this.props.navigation.navigate('User');
            } else {
                this.props.navigation.navigate('Splash');
            }
        });
        this.props.setUserProfile();
        this.checkMyEvents()
        checkCameraPermission()
        checkAudioPermission()
    }

    checkMyEvents = async () => {
        const { uid } = auth().currentUser
        this.setState({ isLoading: true })
        const { IN_PROGRESS, SUSPENDED, SCHEDULED, COMPLETED } = app.EVENT_STATUS
        var pathToEvents = `events`;
        // TODO: filter events based on status [All the events except COMPLETED]


        db.collection(pathToEvents).where('uid', '==', uid)
            .onSnapshot((querySnapshot) => {
                var liveEvents = [];
                var upcomingEvents = [];
                var pastEvents = [];
                querySnapshot.forEach(function (doc) {
                    let event = doc.data()
                    // Convert Firebase Timestamp tp JS Date object
                    let date = event.eventDate
                    if (date instanceof firestore.Timestamp) {
                        date = date.toDate();
                    } else if (eventData.eventTimestamp) {
                        date = new Date(eventData.eventTimestamp)
                    }
                    event.eventDate = date
                    if (event.status === SUSPENDED || event.status === IN_PROGRESS) liveEvents.push(event)
                    if (event.status === SCHEDULED) upcomingEvents.push(event)
                    if (event.status === COMPLETED) pastEvents.push(event)
                });
                console.log('liveEvents', liveEvents)
                console.log('upcomingEvents', upcomingEvents)
                console.log('pastEvents', pastEvents)
                this.setState({ liveEvents, upcomingEvents, pastEvents, isLoading: false })
                //return events;
            });
    }

    componentWillUnmount() {
        if (this.authListener) {
            console.log('authListener Unmounts');
            this.authListener();
        }
    }

    onEventPublish = (event) => {
        let { events } = this.state;
        events.push(event)
        this.setState({ events })
        this.props.navigation.navigate('MyEvent', { event })
    }

    renderEventList = () => {
        const { liveEvents, upcomingEvents, isLoading } = this.state;
        if (isLoading) return <ActivityIndicator size='large' />
        liveEvents.sort(compare)
        upcomingEvents.sort(compare)
        // List SCHEDULED EVENT by sorting accordinf to eventDate
        let lives = <View></View>
        if (liveEvents.length > 0) {
            lives = <View>
                <BoldLabel label='Live Now!' />
                {liveEvents.map((event, i) => {
                    let description = event.eventDate.toLocaleString()
                    return (
                        <ListItem
                            key={i}
                            leftAvatar={{ source: { uri: event.image } }}
                            rightIcon={{ type: 'material-community', name: 'chevron-right' }}
                            title={event.title}
                            titleStyle={{ fontWeight: 'bold' }}
                            subtitle={description}
                            containerStyle={{ borderWidth: 0.7, borderRadius: 6, marginTop: 7, elevation: 1 }}
                            onPress={() => this.props.navigation.navigate('MyEvent', { event: event })}
                        />
                    );
                })}
            </View>
        }
        // List SCHEDULED EVENT by sorting accordinf to eventDate
        let upcomings = <View></View>
        if (upcomingEvents.length > 0) {
            upcomings = <View>
                <Label label='Your Upcoming Meetings' />
                {upcomingEvents.map((event, i) => {
                    let description = event.eventDate.toLocaleString()
                    return (
                        <ListItem
                            key={i}
                            leftAvatar={{ source: { uri: event.image } }}
                            rightIcon={{ type: 'material-community', name: 'chevron-right' }}
                            title={event.title}
                            titleStyle={{ fontWeight: 'bold' }}
                            subtitle={description}
                            onPress={() => this.props.navigation.navigate('MyEvent', { event: event })}
                            containerStyle={{ borderWidth: 0.7, borderRadius: 6, marginTop: 7, elevation: 1 }}
                        />
                    );
                })}
            </View>
        } else {
            upcomings = <Text>No upcoming events!</Text>
        }

        return <View>
            {lives}
            {upcomings}
        </View>
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#3598FE' }}>
                <DashboardHeader
                    navigation={this.props.navigation}
                //earnings={earnings} // TODO
                />
                <View style={styles.container}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <DefaultButton
                            title='+ Create an Event'
                            onPress={() => this.props.navigation.navigate('EventCreate')} />
                        <ClearButton
                            title='Join a show'
                            onPress={() => this.props.navigation.navigate('MyTicket')} />
                    </View>
                    <ScrollView overScrollMode='never'>
                        {this.renderEventList()}
                        <ContactUs title='Have a problem?' screen='EventList' />
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    }
})

export default connect(null, { setUserProfile })(EventListScreen);
import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import { auth } from "react-native-firebase";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation'

import { checkAudioPermission, checkCameraPermission, compare } from '../utils/Utils';
import * as actions from '../appstate/actions/host_actions';
import app from "../constants/app";
import { ContactUs } from '../components/ContactUs';
import { DefaultButton, ClearButton, ClickableText } from '../components/Buttons';
import { Label, BoldLabel } from '../components/Labels';
import DashboardHeader from "../components/DashboardHeader";
import CustomStatusBar from '../components/StatusBars/CustomStatusBar';

const { SCHEDULED, SUSPENDED, IN_PROGRESS, COMPLETED } = app.EVENT_STATUS


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
            if (user && !user.isAnonymous) {
                this.props.navigation.navigate('User');
            } else {
                this.props.navigation.navigate('Splash');
            }
        });
        checkCameraPermission()
        checkAudioPermission()

        //this.props.setAllEventsListener()
    }

    componentWillUnmount() {
        /* if (this.authListener) {
            console.log('authListener Unmounts');
            this.authListener();
        } */
    }

    renderEventList = () => {
        const events = this.props.events;
        let upcomingEvents = [], liveEvents = [], pastEvents = []

        for (var key in events) {
            let event = events[key]
            if (event.status === SUSPENDED || event.status === IN_PROGRESS) liveEvents.push(event)
            if (event.status === SCHEDULED) upcomingEvents.push(event)
            if (event.status === COMPLETED) pastEvents.push(event)
        }

        liveEvents.sort(compare)
        upcomingEvents.sort(compare)
        // List SCHEDULED EVENT by sorting accordinf to eventDate
        let lives = null
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
                            onPress={() => {
                                console.log('before goin settin eventid', event)
                                this.props.setEventId(event.eventId)
                                this.props.navigation.navigate('Host', { eventId: event.eventId })
                            }}
                        />
                    );
                })}
            </View>
        }
        // List SCHEDULED EVENT by sorting according to eventDate
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
                            onPress={() => {
                                console.log('before goin settin eventid', event)
                                this.props.setEventId(event.eventId)
                                this.props.navigation.navigate('Host', { eventId: event.eventId })
                            }}
                            containerStyle={{ borderWidth: 0.7, borderRadius: 6, marginTop: 7, elevation: 1 }}
                        />
                    );
                })}
            </View>
        } else {
            upcomings = <View style={{ alignSelf: 'center', alignItems: 'center', margin: 20 }}>
                <Label label='Your Upcoming Meetings' />
                <Image source={require('../assets/no-event.png')} />
                <Text>
                    You don’t have any scheduled meetings.
                </Text>
                <ClickableText text='Let’s create one!' onPress={() => this.props.navigation.navigate('EventCreate')} />
            </View>
        }

        return <View>
            {lives && lives}
            {upcomings}
        </View>
    }

    render() {
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: "#3598FE" }} />
                <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} >
                    <View style={{ flex: 1, backgroundColor: '#3598FE' }}>
                        <CustomStatusBar />
                        <DashboardHeader
                            profile={this.props.profile}
                            navigation={this.props.navigation}
                        //earnings={earnings} // TODO
                        />
                        <View style={styles.container}>
                            <ScrollView overScrollMode='never' contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                                <View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                        <DefaultButton
                                            title='+ Create an Event'
                                            onPress={() => this.props.navigation.navigate('EventCreate')} />
                                        <ClearButton
                                            title='Join a show'
                                            onPress={() => this.props.navigation.navigate('Ticket')} />
                                    </View>
                                    {this.renderEventList()}
                                </View>
                            </ScrollView>
                            <ContactUs title='Have a problem?' screen='EventList' />
                        </View>
                    </View>
                </SafeAreaView>
            </Fragment>
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

const mapStateToProps = ({ auth, events }) => {
    console.log('eventList mapStateToProps', events)
    return { profile: auth.profile, events: events.myEvents }
}

export default connect(mapStateToProps, actions)(EventListScreen);
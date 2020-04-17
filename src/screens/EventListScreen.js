import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Card, ListItem, Avatar } from 'react-native-elements';
import { firestore, auth } from "react-native-firebase";
import { connect } from 'react-redux';

import { setUserProfile } from "../appstate/actions/auth_actions";
import { checkAudioPermission, checkCameraPermission } from '../utils/Utils';
import { ContactUs } from '../components/ContactUs';

const db = firestore()

class UserHeader extends React.Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                    rounded={true}
                    size='small'
                    source={{ uri: auth().currentUser.photoURL }}
                />
                <Text style={{ paddingLeft: 10, fontSize: 20 }}>{auth().currentUser.displayName}</Text>
            </View>
        );
    }
}


class EventListScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: () => <UserHeader />,
        headerRight: () => (
            <Button
                type='clear'
                onPress={() => navigation.navigate('Profile')}
                title={'Account'}
                titleStyle={{ color: 'grey' }}
                icon={{ type: 'material-community', name: 'settings', size: 15, color: 'grey' }}
                iconRight
            />
        )
    });

    state = {
        events: [],
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
        var pathToEvents = `users/${uid}/myevents`;
        // TODO: filter events based on status [All the events except COMPLETED]
        let events = await db.collection(pathToEvents).where('eventDate', '>=', new Date()).orderBy('eventDate').get()
            .then((querySnapshot) => {
                var events = [];
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
                    events.push(event);
                });
                return events;
            });
        console.log('events here', events)
        this.setState({ events, isLoading: false })
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
        const { events, isLoading } = this.state;
        if (isLoading) return <ActivityIndicator size='large' />

        if (events.length > 0) {
            return events.map((event, i) => {
                let description = event.description.substring(0, 20) || 'No description';
                description = description + '\n' + event.eventDate.toLocaleString()
                return (
                    <ListItem
                        key={i}
                        leftAvatar={{ source: { uri: event.image } }}
                        rightIcon={{ type: 'material-community', name: 'chevron-right' }}
                        title={event.title}
                        subtitle={description}
                        bottomDivider
                        onPress={() => this.props.navigation.navigate('MyEvent', { event: event })}
                    />
                );
            })
        } else {
            return <Text>No upcoming events!</Text>
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Card containerStyle={{ margin: 0, flex: 1, alignSelf: 'stretch' }} >
                    <View style={{ justifyContent: 'flex-start', height: '100%', borderWidth: 0 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', borderBottomWidth: 1 }}>
                            <Button
                                type='clear'
                                icon={{ type: 'material-community', name: 'ticket' }}
                                title='Join Event'
                                onPress={() => this.props.navigation.navigate('MyTicket')} />
                            <Button
                                type='clear'
                                icon={{ type: 'material-community', name: 'cast' }}
                                title='Create Event'
                                onPress={() => this.props.navigation.navigate('EventCreate')} />
                        </View>
                        <ScrollView overScrollMode='never'>
                            {this.renderEventList()}
                        </ScrollView>
                    <ContactUs title='Have a problem?' screen='EventList' />

                    </View>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
})

export default connect(null, { setUserProfile })(EventListScreen);
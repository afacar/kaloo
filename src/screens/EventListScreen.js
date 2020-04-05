import React, { Component } from 'react';
import { View, StyleSheet, PermissionsAndroid, Text, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Button, Card, ListItem, Avatar } from 'react-native-elements';
import firebase from "react-native-firebase";
import { connect } from 'react-redux';
import { setUserProfile } from "../appstate/actions/auth_actions";

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

class UserHeader extends React.Component {
    currentUser = firebase.auth().currentUser
    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                    rounded={true}
                    size='small'
                    source={{ uri: this.currentUser.photoURL }}
                />
                <Text style={{ paddingLeft: 10, fontSize: 20 }}>{this.currentUser.displayName}</Text>
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
        isCreateEvent: false,
        isLoading: false,
    }

    componentDidMount = async () => {
        this.authListener = firebase.auth().onAuthStateChanged(user => {
            console.log('UserHome onAuthStateChange>', user);
            if (user && !user.isAnonymous) {
                this.props.navigation.navigate('User');
            } else {
                this.props.navigation.navigate('Splash');
            }
        });
        this.props.setUserProfile();
        this.checkMyEvents()
        if (Platform.OS === 'android') {
            this.checkCameraPermission();
            this.checkAudioPermission();
        }
    }

    checkMyEvents = async () => {
        this.setState({ isLoading: true })
        var pathToEvents = `users/${auth.currentUser.uid}/myevents`;
        let events = await db.collection(pathToEvents).where('eventDate', '>=', new Date()).orderBy('eventDate').get()
            .then((querySnapshot) => {
                var events = [];
                querySnapshot.forEach(function (doc) {
                    let event = doc.data()
                    // Convert Firebase Timestamp tp JS Date object
                    event.eventDate = event.eventDate.toDate()
                    if (!event.isResizedImage) {
                        let eventTimestamp = event.eventTimestamp || event.eventDate.getTime()
                        let resizedImageFileName = eventTimestamp + '_200x200.jpg'
                        let imagePath = `events/${auth.currentUser.uid}/${resizedImageFileName}`
                        console.log(`Checking resized event images at: ${imagePath}`)
                        const imageRef = storage.ref(imagePath)
                        imageRef.getDownloadURL().then((url) => {
                            // Set resized image as event image
                            db.doc(`events/${event.eventNumber}`).update({ image: url, isResizedImage: true })
                            db.doc(`users/${event.uid}/myevents/${event.eventNumber}`).update({ image: url, isResizedImage: true })
                        }).catch(async (error) => {
                            console.log('No resized event image yet')
                        })
                    }
                    events.push(doc.data());
                });
                console.log("Current events fetched: ", events);
                return events;
            });
        console.log('events here', events)
        this.setState({ events, isLoading: false })
    }

    checkAudioPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone Permission',
                    message:
                        'InfluenceMe needs access to your camera',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // granted
            } else {
                // not granted
            }
        } catch (err) {
            // console.warn(err);
        }
    }

    checkCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
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
        this.setState({ events, isCreateEvent: false })
        this.props.navigation.navigate('MyEvent', { event })
    }

    renderEventList = () => {
        const { events, isLoading } = this.state;
        if (isLoading) return <ActivityIndicator size='large' />

        if (events.length > 0) {
            return events.map((e, i) => {
                return (
                    <ListItem
                        key={i}
                        leftAvatar={{ source: { uri: e.image } }}
                        rightIcon={{ type: 'material-community', name: 'chevron-right' }}
                        roundAvatar
                        title={e.title}
                        subtitle={e.description || 'No description'}
                        avatar={{ uri: e.image }}
                        bottomDivider
                        onPress={() => this.props.navigation.navigate('MyEvent', { event: e })}
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
                                onPress={() => this.props.navigation.navigate('CreateEvent')} />
                        </View>
                        <ScrollView overScrollMode='never'>
                            {this.renderEventList()}
                        </ScrollView>
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
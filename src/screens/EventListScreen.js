import React, { Component } from 'react';
import { View, StyleSheet, PermissionsAndroid, FlatList } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Card, ListItem } from 'react-native-elements';
import firebase from "react-native-firebase";
const db = firebase.firestore()
const auth = firebase.auth()

class EventListScreen extends Component {
    state = {
        events: []
    }

    async componentDidMount() {

        this.authListener = firebase.auth().onAuthStateChanged(user => {
            console.log('EventList onAuthStateChange>', user);
            if (user && !user.isAnonymous) {
                this.props.navigation.navigate('User');
            } else {
                this.props.navigation.navigate('Splash');
            }
        });

        var pathToEvents = `users/${auth.currentUser.uid}/myevents`;
        console.log('pathToEvents', pathToEvents)
        let events = await db.collection(pathToEvents).get()
            .then(function (querySnapshot) {
                var events = [];
                querySnapshot.forEach(function (doc) {
                    events.push(doc.data());
                });
                console.log("Current events fetched: ", events);
                return events;
            });
        console.log('events here', events)
        this.setState({ events })
        this.checkCameraPermission();
        this.checkAudioPermission();
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

    render() {
        const { events } = this.state;
        return (
            <View style={styles.container}>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button
                        title="Create Event"
                        onPress={() => this.props.navigation.navigate('CreateEvent')}
                    />
                    <Button
                        title="Profile"
                        onPress={() => this.props.navigation.navigate('Profile')}
                    />
                    <Button
                        title="Sign Out"
                        onPress={() => firebase.auth().signOut()}
                    />
                </View>
                <Card containerStyle={{ padding: 0, flex: 1, alignSelf: 'stretch' }} title='My Events'>
                    {
                        events.map((e, i) => {
                            return (
                                <ListItem
                                    key={i}
                                    leftAvatar={{ source: { uri: e.image } }}
                                    rightIcon={{ type: 'MaterialCommunity', name: 'chevron-right' }}
                                    roundAvatar
                                    title={e.title}
                                    subtitle={e.description || 'No description'}
                                    avatar={{ uri: e.image }}
                                    bottomDivider
                                    onPress={() => this.props.navigation.navigate('MyEvent', { event: e })}
                                />
                            );
                        })
                    }
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
        borderWidth: 2
    }
})

export default EventListScreen;
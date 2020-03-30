import React, { Component } from 'react';
import { View, StyleSheet, PermissionsAndroid, FlatList, Text, ActivityIndicator, ScrollView } from 'react-native';
import AppText from '../components/AppText';
import { Input, Button, Card, ListItem, Icon, Image, Avatar } from 'react-native-elements';
import firebase from "react-native-firebase";

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

const DEFAULT_EVENT_PIC = 'https://firebasestorage.googleapis.com/v0/b/influenceme-dev.appspot.com/o/assets%2Fbroadcast-media.png?alt=media&token=608c9143-879d-4ff7-a30d-ac61ba319904'

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
                <Button
                    type='clear'
                    onPress={() => this.props.navigation.navigate('Profile')}
                    title={this.currentUser.displayName}
                    icon={{ type: 'MaterialCommunity', name: 'settings', size: 15 }}
                    iconRight
                />
            </View>
        );
    }
}


class EventListScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: () => <UserHeader navigation={navigation} />,
        headerRight: () => (
            <Icon
                type='material-community'
                name='home-currency-usd'
                onPress={() => navigation.navigate('Balance')}
                containerStyle={{ marginRight: 10 }}
            />
        )
    });

    state = {
        events: []
    }

    componentDidMount = async () => {
        this.authListener = firebase.auth().onAuthStateChanged(user => {
            console.log('EventList onAuthStateChange>', user);
            if (user && !user.isAnonymous) {
                this.props.navigation.navigate('User');
            } else {
                this.props.navigation.navigate('Splash');
            }
        });

        var pathToEvents = `users/${auth.currentUser.uid}/myevents`;
        let events = await db.collection(pathToEvents).get()
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
                <Card containerStyle={{ borderWidth: 2, margin: 5, flex: 1, alignSelf: 'stretch' }} >
                    <View style={{ justifyContent: 'flex-start', height: '100%', borderWidth: 0 }}>
                        {
                            <View>
                                <ListItem
                                    key={'Create'}
                                    leftIcon={{ type: 'MaterialCommunity', name: 'cast' }}
                                    title={'Create Event'}
                                    bottomDivider
                                    onPress={() => this.props.navigation.navigate('CreateEvent')}
                                />
                                <ListItem
                                    key={'Join'}
                                    leftIcon={{ type: 'entypo', name: 'ticket' }}
                                    title={'Join Event'}
                                    bottomDivider
                                    onPress={() => this.props.navigation.navigate('Ticket')}
                                />
                            </View>
                        }
                        <ScrollView overScrollMode='never'>
                            {
                                events.length > 0 && events.map((e, i) => {
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
        borderWidth: 2
    }
})

export default EventListScreen;